
import React from "react";
import {cn} from "@nextui-org/react";

export type UserReviewProps = React.HTMLAttributes<HTMLDivElement> & {
  avatar: string;
  name: string;
  content: string;
};

const UserReview = React.forwardRef<HTMLDivElement, UserReviewProps>(
  ({children, name, avatar, content, className, ...props}, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col gap-2.5 rounded-medium bg-content1 p-5 shadow-small", className)}
      {...props}
    >
      <div className="flex items-center gap-2">
        <img alt={name} className="h-7 w-7 rounded-full" src={avatar} loading="lazy" />
        <span className="text-small text-foreground">{name}</span>
      </div>
      <p className="text-default-700">{content || children}</p>
    </div>
  ),
);

UserReview.displayName = "UserReview";

export default UserReview;
