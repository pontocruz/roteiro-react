interface Props {
    text?: string | null;
    onMentionClick?: (id: number) => void;
    highlightedId?: number | null;  // Add this
}


export function MentionParser({ text, onMentionClick }: Props) {
    if (!text) return null;

    const handleClick = (id: number) => {
        console.log('Mention clicked:', id); // For debugging
        onMentionClick?.(id);
    };

    const parts = text.split(/(@\[\d+\|[^\]]+\])/);

    return (
        <>
            {parts.map((part, i) => {
                const match = part.match(/@\[(\d+)\|([^\]]+)\]/);
                if (match) {
                    return (
                        <button
                            key={i}
                            className="mention-btn"
                            onClick={() => handleClick(Number(match[1]))}
                            data-personagem-id={match[1]}
                        >
                            {match[2]}
                        </button>
                    );
                }
                return <span key={i}>{part}</span>;
            })}
        </>
    );
}