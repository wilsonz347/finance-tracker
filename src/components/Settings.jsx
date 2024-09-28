import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function Settings() {
  const [dailyReminders, setDailyReminders] = useState(false);
  const [weeklySummaries, setWeeklySummaries] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="daily-reminders">Daily Reminders</Label>
          <Switch
            id="daily-reminders"
            checked={dailyReminders}
            onCheckedChange={setDailyReminders}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="weekly-summaries">Weekly Summaries</Label>
          <Switch
            id="weekly-summaries"
            checked={weeklySummaries}
            onCheckedChange={setWeeklySummaries}
          />
        </div>
      </CardContent>
    </Card>
  );
}
