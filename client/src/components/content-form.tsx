import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  generateContentSchema,
  type GenerateContentRequest,
} from "@shared/schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import TopicSuggestions from "./topic-suggestions";

const SPORTS = [
  "Football",
  "Basketball",
  "Baseball",
  "Soccer",
  "Tennis",
  "Golf",
  "Hockey",
  "Boxing",
  "MMA",
  "Athletics",
];

const TONES = [
  "Professional",
  "Casual",
  "Technical",
  "Entertaining",
  "Analytical",
];

interface ContentFormProps {
  onSubmit: (data: GenerateContentRequest) => void;
  isLoading: boolean;
}

export default function ContentForm({ onSubmit, isLoading }: ContentFormProps) {
  // Memoize the form to prevent recreating it on every render
  const form = useForm<GenerateContentRequest>({
    resolver: zodResolver(generateContentSchema),
    defaultValues: {
      topic: "",
      type: "article",
      sportType: "Football",
      tone: "Professional",
      length: 1000,
    },
  });

  // Memoize the submit handler to prevent recreating it on every render
  const handleFormSubmit = useCallback(
    (data: GenerateContentRequest) => {
      onSubmit(data);
    },
    [onSubmit]
  );

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="space-y-6"
      >
        <div className="grid md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="sportType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sport</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {SPORTS.map((sport) => (
                      <SelectItem key={sport} value={sport}>
                        {sport}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content Type</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="article">Article</SelectItem>
                    <SelectItem value="script">Video Script</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="topic"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Topic</FormLabel>
              <FormControl>
                <Input placeholder="Enter your topic" {...field} />
              </FormControl>
              <FormMessage />
              <TopicSuggestions
                sport={form.watch("sportType")}
                onSelect={(topic) => form.setValue("topic", topic)}
              />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tone</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {TONES.map((tone) => (
                    <SelectItem key={tone} value={tone}>
                      {tone}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="length"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Length (words): {field.value}</FormLabel>
              <FormControl>
                <Slider
                  min={100}
                  max={2000}
                  step={100}
                  value={[field.value]}
                  onValueChange={([value]) => field.onChange(value)}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Generating..." : "Generate Content"}
        </Button>
      </form>
    </Form>
  );
}
