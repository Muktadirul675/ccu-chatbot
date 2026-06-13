export default function Loading() {
    return <div className="w-full h-screen flex items-center justify-center">
        <div className="mt-[-10%] flex rounded-lg flex-col justify-center items-center p-7 bg-subtle shadow border border-gray-300">
            <img className="h-10 w-10" src="/loading.gif" alt="" />
            <h3 className="text-gray-500 font-semibold">
                Loading
            </h3>
        </div>
    </div>
}