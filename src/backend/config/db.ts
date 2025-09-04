import { Pool } from "pg";

// 连接池单例
let globalPool: Pool;

export function getDb() {
  if (globalPool) return globalPool;

  const connectionString = process.env.POSTGRES_URL;
  if (!connectionString) {
    throw new Error(
      "POSTGRES_URL 未配置。请在部署环境变量中设置 Supabase 的连接串（推荐 Pgbouncer 池化地址）。"
    );
  }

  // 尝试解析连接串，给出更友好的错误提示
  let host = "";
  try {
    const u = new URL(connectionString);
    host = u.hostname || "";
    const raw = u.toString();
    if (raw.includes("@") && /postgres:\/\/[^:]+:[^@]*@[^/]+/i.test(raw)) {
      // 如果密码中包含未转义的 @，URL 可能被截断，提示开发者进行 URL 编码
      const afterScheme = raw.split("postgres://")[1] || "";
      const userInfo = afterScheme.split("@")[0];
      if (userInfo && userInfo.split(":").length >= 2 && userInfo.endsWith("@")) {
        throw new Error(
          "检测到 POSTGRES_URL 中密码可能包含未转义的 @。请将密码中的 @ 替换为 %40，或使用 Supabase 控制台复制的连接串。"
        );
      }
    }
  } catch (e: any) {
    // URL 解析失败，保留原错误但提供指引
    throw new Error(
      `POSTGRES_URL 解析失败: ${e?.message || e}. 请确认使用了有效的连接串（建议使用 Supabase Pgbouncer 池化 6543 端口，密码如含特殊字符需 URL 编码）。`
    );
  }

  // Supabase/云数据库通常需要 TLS；若是 Supabase 则强制开启 SSL
  const needSSL = host.includes("supabase.co") || process.env.PGSSLMODE === "require";

  globalPool = new Pool({
    connectionString,
    ssl: needSSL ? { rejectUnauthorized: false } : undefined,
    max: 5,
  });

  return globalPool;
}
