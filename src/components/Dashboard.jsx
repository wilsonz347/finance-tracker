import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Current Mood</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl">😊</p>
          <p>Good</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Journal Streak</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl">7</p>
          <p>days</p>
        </CardContent>
      </Card>
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Latest Journal Entry</CardTitle>
        </CardHeader>
        <CardContent>
          <h3 className="font-bold">A Productive Day</h3>
          <p className="line-clamp-3">
            Today was a great day. I accomplished all my tasks and had time for
            self-care...
          </p>
        </CardContent>
      </Card>
      <div className="flex justify-center space-x-4 md:col-span-2">
        <Button asChild>
          <Link to="/mood">Log Mood</Link>
        </Button>
        <Button asChild>
          <Link to="/journal">New Journal Entry</Link>
        </Button>
      </div>
    </div>
  );
}
