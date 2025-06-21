import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import {
  IconMicrophone,
  IconBrain,
  IconFileText,
  IconHistory,
  IconSettings,
  IconRobot,
  IconSpeakerphone,
} from "@tabler/icons-react";

const Skeleton = () => (
  <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-200 dark:from-neutral-900 dark:to-neutral-800 to-neutral-100"></div>
);

const items = [
  {
    title: "Voice Recording",
    description: "Start recording your voice and get instant transcriptions.",
    header: <Skeleton />,
    icon: <IconMicrophone className="h-4 w-4 text-neutral-500" />,
    className: "md:col-span-2",
  },
  {
    title: "AI Processing",
    description: "Clean, formalize, or summarize your speech with AI.",
    header: <Skeleton />,
    icon: <IconBrain className="h-4 w-4 text-neutral-500" />,
    className: "md:col-span-1",
  },
  {
    title: "Recent Transcripts",
    description: "View and manage your recent voice transcriptions.",
    header: <Skeleton />,
    icon: <IconFileText className="h-4 w-4 text-neutral-500" />,
    className: "md:col-span-1",
  },
  {
    title: "Voice Commands",
    description: "Use your voice as prompts for AI bots and assistants.",
    header: <Skeleton />,
    icon: <IconRobot className="h-4 w-4 text-neutral-500" />,
    className: "md:col-span-2",
  },
  {
    title: "History",
    description: "Access your complete voice recording history.",
    header: <Skeleton />,
    icon: <IconHistory className="h-4 w-4 text-neutral-500" />,
    className: "md:col-span-1",
  },
  {
    title: "Speech Analytics",
    description: "Get insights about your speaking patterns and habits.",
    header: <Skeleton />,
    icon: <IconSpeakerphone className="h-4 w-4 text-neutral-500" />,
    className: "md:col-span-2",
  },
];

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
      <p className="text-muted-foreground mb-8">
        Welcome back! Start recording or explore your features.
      </p>
      <BentoGrid className="mx-auto">
        {items.map((item, i) => (
          <BentoGridItem
            key={i}
            title={item.title}
            description={item.description}
            header={item.header}
            icon={item.icon}
            className={item.className}
          />
        ))}
      </BentoGrid>
    </div>
  );
} 