import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { getUserData } from "../api/api";

export default function Dashboard() {
  const [userData, setUserData] = useState(null);
  const [loading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getUserData(userId);
        setUserData(response.data);
        setIsLoading(false);
      } catch (error) {
        console.log("Errjor fetching user data:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!userData) {
    return <div>Error loading data. please try again.</div>;
  }

  const latestMood = userData.moods[userData.moods.length - 1] || {
    emoji: "😐",
    label: "No mood logged",
  };
  const latestJournalEntry = userData.journal_entries[
    userData.journal_entries.length - 1
  ] || { title: "No entries yet", content: "Start journaling today!" };
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Current Mood</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl">{latestMood.emoji}</p>
          <p>{latestMood.label}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Journal Streak</CardTitle>
        </CardHeader>
        <CardContent>
          {/* we will add this later */}
          <p className="text-4xl">{0}</p>
          <p>days</p>
        </CardContent>
      </Card>
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Latest Journal Entry</CardTitle>
        </CardHeader>
        <CardContent>
          <h3 className="font-bold">{latestJournalEntry.title}</h3>
          <p className="line-clamp-3">{latestJournalEntry.content}</p>
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
