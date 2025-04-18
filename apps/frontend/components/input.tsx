"use client";
import { useState } from "react";
import { Calendar } from "@shadcn/ui/calendar";

export const Input = () => {
  const [value, setValue] = useState("");
  const [date, setDate] = useState<Date | undefined>(new Date());
  return (
    <>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="border border-gray-300 rounded-md p-2 focus:outline-none"
      />

      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="rounded-md border shadow"
      />
    </>
  );
};
