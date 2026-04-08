interface Props {
  type: "line" | "wave" | "angle" | "dots";
  color: string;
}

export function SectionDivider({ type, color }: Props) {
  switch (type) {
    case "line":
      return (
        <div className="flex justify-center py-4">
          <div className="h-px w-2/3" style={{ backgroundColor: color }} />
        </div>
      );

    case "wave":
      return (
        <svg
          viewBox="0 0 1440 60"
          preserveAspectRatio="none"
          className="block w-full"
          style={{ height: 40 }}
        >
          <path
            d="M0,30 C360,60 720,0 1080,30 C1260,45 1350,30 1440,30 L1440,60 L0,60 Z"
            fill={color}
          />
        </svg>
      );

    case "angle":
      return (
        <svg
          viewBox="0 0 1440 60"
          preserveAspectRatio="none"
          className="block w-full"
          style={{ height: 40 }}
        >
          <polygon points="0,0 1440,60 0,60" fill={color} />
        </svg>
      );

    case "dots":
      return (
        <div className="flex items-center justify-center gap-2 py-6">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="size-1.5 rounded-full"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      );

    default:
      return null;
  }
}
