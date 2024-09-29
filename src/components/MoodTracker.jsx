import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { addMoodEntry } from "../api/api";

const moods = [
  { emoji: "😢", label: "Terrible" },
  { emoji: "😕", label: "Bad" },
  { emoji: "😐", label: "Neutral" },
  { emoji: "😊", label: "Good" },
  { emoji: "😃", label: "Great" },
];

export default function MoodTracker() {
  const [selectedMood, setSelectedMood] = useState(null);

  const handleSubmit = async () => {
    if (selectedMood !== null) {
      try {
        await addMoodEntry(moods[selectedMood].label, "");
        console.log("Mood submitted:", moods[selectedMood].label);
        setSelectedMood(null);
      } catch (error) {
        console.error("Error submitting mood:", error);
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>How are you feeling today?</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between mb-4">
          {moods.map((mood, index) => (
            <Button
              key={index}
              variant={selectedMood === index ? "default" : "outline"}
              onClick={() => setSelectedMood(index)}
              className="text-4xl p-4"
            >
              {mood.emoji}
            </Button>
          ))}
        </div>
        {selectedMood !== null && (
          <p className="text-center mb-4">
            You selected: {moods[selectedMood].label}
          </p>
        )}
        <Button
          onClick={handleSubmit}
          disabled={selectedMood === null}
          className="w-full"
        >
          Submit
        </Button>
      </CardContent>
    </Card>
  );
}
