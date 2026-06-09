import { useState } from "react";
import { Bell, Check, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useNotifications, type Notification } from "@/hooks/useNotifications";
import { cn } from "@/lib/utils";

interface Props {
  variant?: "desktop" | "mobile";
}

const ACTOR_KEYS = ["follower_id", "liker_id", "commenter_id", "following_id"] as const;
const ACTION_PHRASES = [
  " wants to follow you",
  " started following you",
  " accepted your follow request",
  " liked your post",
  " commented on your post",
];

const renderBody = (body: string, data: Record<string, unknown> | null, onNavigate: () => void) => {
  if (!data) return body;
  let actorId: string | undefined;
  for (const key of ACTOR_KEYS) {
    const v = data[key];
    if (typeof v === "string") {
      actorId = v;
      break;
    }
  }
  if (!actorId) return body;

  for (const phrase of ACTION_PHRASES) {
    const idx = body.indexOf(phrase);
    if (idx > 0) {
      const name = body.slice(0, idx);
      const rest = body.slice(idx);
      return (
        <>
          <Link
            to={`/user/${actorId}`}
            onClick={onNavigate}
            className="font-medium text-foreground hover:underline"
          >
            {name}
          </Link>
          {rest}
        </>
      );
    }
  }
  return body;
};

const NotificationBell = ({ variant = "desktop" }: Props) => {
  const [open, setOpen] = useState(false);
  const { notifications, unreadCount, markAllRead, markRead, remove } = useNotifications();

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
  };

  const triggerButton =
    variant === "mobile" ? (
      <Button variant="ghost" size="sm" className="h-10 w-full flex-col gap-0.5 px-1 text-xs relative" aria-label="Notifications">
        <Bell className="h-3.5 w-3.5" />
        <span className="text-xs leading-tight">Alerts</span>
        {unreadCount > 0 && (
          <span className="absolute top-0.5 right-1/2 translate-x-3 h-1.5 w-1.5 rounded-full bg-destructive" />
        )}
      </Button>
    ) : (
      <Button variant="ghost" size="sm" className="p-2 relative" aria-label="Notifications">
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-1 -right-1 h-4 min-w-4 px-1 text-[10px] leading-none flex items-center justify-center rounded-full"
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </Badge>
        )}
      </Button>
    );

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>{triggerButton}</PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between p-3 border-b">
          <h3 className="text-sm font-semibold">Notifications</h3>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => markAllRead.mutate()}>
              <Check className="h-3 w-3 mr-1" /> Mark all read
            </Button>
          )}
        </div>
        <ScrollArea className="max-h-96">
          {notifications.length === 0 ? (
            <div className="p-6 text-center text-sm text-muted-foreground">
              You have no notifications yet.
            </div>
          ) : (
            <ul className="divide-y">
              {notifications.map((n: Notification) => (
                <li
                  key={n.id}
                  className={cn(
                    "p-3 flex gap-2 items-start group",
                    !n.read_at && "bg-muted/40"
                  )}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium leading-tight">{n.title}</p>
                    {n.body && (
                      <p className="text-xs text-muted-foreground mt-0.5 break-words">
                        {renderBody(n.body, n.data, () => setOpen(false))}
                      </p>
                    )}
                    <p className="text-[11px] text-muted-foreground mt-1">
                      {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {!n.read_at && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => markRead.mutate(n.id)}
                        aria-label="Mark as read"
                      >
                        <Check className="h-3 w-3" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 text-destructive"
                      onClick={() => remove.mutate(n.id)}
                      aria-label="Delete notification"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationBell;