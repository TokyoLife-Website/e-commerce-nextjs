import React from "react";

interface TrendSuggestionItemProps {
  suggestion: string;
  handleTrendSuggestion: (suggestion: string) => void;
}

const TrendSuggestionItem: React.FC<TrendSuggestionItemProps> = ({
  suggestion,
  handleTrendSuggestion,
}) => {
  return (
    <div
      onClick={() => handleTrendSuggestion(suggestion)}
      key={suggestion}
      className="m-0 font-normal text-[13px] leading-4 text-center text-[#555555] py-1 px-3 bg-[#f5f5f5] rounded cursor-pointer max-w-[150px] whitespace-nowrap overflow-hidden text-ellipsis"
    >
      {suggestion}
    </div>
  );
};

export default TrendSuggestionItem;
