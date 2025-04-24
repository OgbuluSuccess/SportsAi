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
        className="space-y-8 bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-100"
      >
        <div className="grid md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="sportType"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-gray-700">Sport</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="bg-white border-gray-200 focus:ring-2 focus:ring-blue-500 transition-all duration-200">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {SPORTS.map((sport) => (
                      <SelectItem key={sport} value={sport} className="hover:bg-blue-50">
                        {sport}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-gray-700">Content Type</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="bg-white border-gray-200 focus:ring-2 focus:ring-blue-500 transition-all duration-200">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="article" className="hover:bg-blue-50">Article</SelectItem>
                    <SelectItem value="script" className="hover:bg-blue-50">Video Script</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="topic"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold text-gray-700">Topic</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your topic"
                  {...field}
                  className="bg-white border-gray-200 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                />
              </FormControl>
              <FormMessage />
              <TopicSuggestions
                sport={form.watch("sportType")}
                onSelect={(topic) => form.setValue("topic", topic)}
                className="mt-2"
              />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tone"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold text-gray-700">Tone</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className="bg-white border-gray-200 focus:ring-2 focus:ring-blue-500 transition-all duration-200">
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {TONES.map((tone) => (
                    <SelectItem key={tone} value={tone} className="hover:bg-blue-50">
                      {tone}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="length"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold text-gray-700">
                Length (words): {field.value}
              </FormLabel>
              <FormControl>
                <Slider
                  min={100}
                  max={2000}
                  step={100}
                  value={[field.value]}
                  onValueChange={([value]) => field.onChange(value)}
                  className="py-4"
                  thumbClassName="bg-blue-600 border-2 border-white shadow-md"
                  trackClassName="bg-gray-200"
                  activeTrackClassName="bg-blue-500"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin h-5 w-5 mr-2 text-white"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Generating...
            </span>
          ) : (
            "Generate Content"
          )}
        </Button>
      </form>
    </Form>
  );
}