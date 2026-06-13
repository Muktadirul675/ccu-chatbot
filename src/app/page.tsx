import ChatWidget from "@/components/ChatWidget";

export default function Home() {
  return (
    <div className="flex flex-col">
      <div className="bg-primary p-3 text-center text-white">
        The website below is a preview of ccu. We used this to create a deployed chatbot expericence.
      </div>
      <iframe src="https://www.calcoast.edu/" className="w-full min-h-screen"></iframe>
      <ChatWidget/>
    </div>
  );
}
