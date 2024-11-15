enum Role {
    User,
    AiResponse,
}

interface ChatProps {
    role: Role;
    text: string;
}

export default function Chats({ role, text }: ChatProps) {
    return (
        <div
            className={`flex items-center space-x-4 p-4 ${
                role === Role.User ? "flex-row-reverse" : ""
            }`}
        >
            {role === Role.User && (
                <img src="/user-avatar.png" alt="User" className="w-8 h-8 rounded-full" />
            )}
            {role === Role.AiResponse && (
                <img src="/ai-avatar.png" alt="AI" className="w-8 h-8 rounded-full" />
            )}
            <div
                className={`${
                    role === Role.User ? "bg-blue-400 !important text-white" : "bg-blue-200 text-black"
                } border-2 rounded-full p-4 max-w-xs`}
                dangerouslySetInnerHTML={{ __html: text }}
            />
        </div>
    );
}
