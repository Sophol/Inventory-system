import { TooltipProps } from "recharts";
import { formatCurrency } from "@/lib/utils";

const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip bg-white p-2 border border-gray-300 rounded shadow-lg">
        <p className="label mb-2">{`${label}`}</p>
        {payload.map((entry, index) => (
          <div
            key={`item-${index}`}
            className="intro flex justify-between gap-8 p-0.5"
          >
            <span
              className="font-bold"
              style={{ color: entry.color }} // Apply the color to the text
            >
              {entry.name}:
            </span>{" "}
            <span className="text-right font-bold">
              {formatCurrency(entry.value ?? 0)}
            </span>
          </div>
        ))}
      </div>
    );
  }

  return null;
};

export default CustomTooltip;
