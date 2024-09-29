import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { getUserData } from "../api/api";

export default function Dashboard({ userId }) {
  const [userData, setUserData] = useState(null);
  const [loading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getUserData(userId);
        setUserData(response.data);
        setIsLoading(false);
      } catch (error) {
        console.log("Error fetching user data:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!userData) {
    return <div>Error loading data. Please try again.</div>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>User Info</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Username: {userData.username}</p>
          <p>Email: {userData.email}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Latest Mood</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{userData.latest_mood || "No mood logged"}</p>
        </CardContent>
      </Card>
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Latest Journal Entry</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{userData.latest_writing || "No journal entry yet"}</p>
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
