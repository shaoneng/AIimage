import colorConfig from '@/config/colors.json';

export type ColorTheme = {
  name: string;
  colors: {
    primary: string;
    "primary-dark": string;
    secondary: string;
    accent: string;
    background: string;
    foreground: string;
    muted: string;
  };
};

export type ColorConfig = {
  themes: Record<string, ColorTheme>;
  currentTheme: string;
};

export function getColorConfig(): ColorConfig {
  return colorConfig as ColorConfig;
}

export function getCurrentTheme(): ColorTheme {
  const config = getColorConfig();
  return config.themes[config.currentTheme];
}

export function getThemeByName(themeName: string): ColorTheme | null {
  const config = getColorConfig();
  return config.themes[themeName] || null;
}

export function getAllThemes(): Record<string, ColorTheme> {
  const config = getColorConfig();
  return config.themes;
}

export function getThemeNames(): string[] {
  const config = getColorConfig();
  return Object.keys(config.themes);
}

// 应用CSS变量到根元素
export function applyTheme(theme: ColorTheme) {
  if (typeof document === 'undefined') return;
  
  const root = document.documentElement;
  
  console.log('Applying theme:', theme.name, theme.colors);
  
  // 设置主要CSS变量
  root.style.setProperty('--primary', theme.colors.primary);
  root.style.setProperty('--primary-dark', theme.colors["primary-dark"]);
  root.style.setProperty('--secondary', theme.colors.secondary);
  root.style.setProperty('--accent', theme.colors.accent);
  root.style.setProperty('--background', theme.colors.background);
  root.style.setProperty('--foreground', theme.colors.foreground);
  root.style.setProperty('--muted', theme.colors.muted);
  
  // 设置衍生颜色
  root.style.setProperty('--primary-foreground', '0 0% 100%');
  root.style.setProperty('--secondary-foreground', theme.colors.foreground);
  root.style.setProperty('--accent-foreground', '0 0% 100%');
  root.style.setProperty('--muted-foreground', theme.colors.muted);
  
  // 卡片和其他组件颜色
  root.style.setProperty('--card', theme.colors.background);
  root.style.setProperty('--card-foreground', theme.colors.foreground);
  root.style.setProperty('--popover', theme.colors.background);
  root.style.setProperty('--popover-foreground', theme.colors.foreground);
  
  // 边框和输入框
  root.style.setProperty('--border', theme.colors.secondary);
  root.style.setProperty('--input', theme.colors.secondary);
  root.style.setProperty('--ring', theme.colors.primary);
  
  // 警告色保持不变
  root.style.setProperty('--destructive', '0 84% 60%');
  root.style.setProperty('--destructive-foreground', '0 0% 100%');
  
  console.log('Applied CSS variables:', {
    primary: root.style.getPropertyValue('--primary'),
    secondary: root.style.getPropertyValue('--secondary'),
    accent: root.style.getPropertyValue('--accent')
  });
}