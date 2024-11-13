import { useState } from "react";
import {
    Dialog,
    DialogBackdrop,
    DialogPanel,
    DialogTitle
} from "@headlessui/react";
import axios from "axios";
import "./App.css";

function App() {
    const [query, setQuery] = useState("");
    const [open, setOpen] = useState(false);
    const [selectedSong, setSelectedSong] = useState(null);
    const [queryResult, setQueryResult] = useState(null); // query result is a JSON array

    // Open dialog for the selected song / track
    const openDialog = songs => {
        setSelectedSong(songs);
        setOpen(true);
    };

    const handleSearch = async () => {
        try {
            const response = await axios.get(
                `https://lrclib.net/api/search?q=${query}`
            );
            setQueryResult(response.data);
        } catch (error) {
            console.error("Error fetching lyrics:", error);
        }
    };

    // Function to handle lyric line click and extract the timestamps of the clicked line and the next line
    const handleLyricClick = (line, index, lyrics) => {
        // Regular expression to match the timestamp pattern [MM:SS.MS] or MM:SS.MS
        const timestampRegex = /?(\d{2}:\d{2}\.\d{2})?/;

        // Extract the timestamp from the current line
        const match = line.match(timestampRegex);
        const startingTimestamp = match ? match[1] : null;

        // Get the next line and extract its timestamp if it exists
        const nextLine = lyrics[index + 1];
        const nextTimestampMatch = nextLine
            ? nextLine.match(timestampRegex)
            : null;
        const endingTimestamp = nextTimestampMatch
            ? nextTimestampMatch[1]
            : null;

        // Display the current and next line information
        alert(
            `Starting Timestamp: ${startingTimestamp || "No timestamp"}\n` +
                `Ending Timestamp: ${endingTimestamp || "No more lines"}`
        );
    };

    return (
        <>
            <div className="bg-white">
                <div className="mx-auto max-w-7xl py-24 sm:px-6 sm:py-32 lg:px-8">
                    <div className="relative isolate overflow-hidden px-6 pt-16 sm:rounded-3xl sm:px-16 md:pt-24 lg:flex lg:gap-x-20 lg:px-24 lg:pt-0">
                        <div className="mx-auto max-w-md text-center lg:mx-0 lg:flex-auto lg:py-32 lg:text-left">
                            <h2 className="text-3xl font-black text-black tracking-tight sm:text-4xl">
                                Boost your productivity. Start using our app
                                today.
                            </h2>

                            <div className="mt-10 flex items-center justify-center lg:justify-start">
                                <input
                                    type="text"
                                    className="form-input rounded-full px-3.5 py-2.8 text-sm font-bold placeholder:text-gray-500 hover:border-indigo-800 hover:border"
                                    placeholder="Your query...."
                                    value={query}
                                    onChange={e => setQuery(e.target.value)}
                                />
                                <button
                                    onClick={handleSearch}
                                    className="rounded-full bg-indigo-800 px-3.5 py-2.5 ml-2 text-sm font-bold text-white shadow-sm border-2 hover:bg-white hover:text-indigo-800 hover:border-indigo-700"
                                >
                                    Find
                                </button>
                            </div>

                            {/* People List */}
                            <div className="bg-gray-100 border-2 border-gray-300 rounded-2xl mt-8 px-4 py-3.5 mx-auto flex justify-center">
                                <ul
                                    role="list"
                                    className="divide-y divide-gray-100 w-full max-w-md"
                                >
                                    {queryResult &&
                                        queryResult.length > 0 &&
                                        queryResult.map(songs => (
                                            <li
                                                key={songs.id}
                                                className="flex justify-between items-center gap-x-4 py-4"
                                            >
                                                {/* Song Info */}
                                                <div className="flex flex-col flex-grow ">
                                                    <p className="text-sm font-semibold text-gray-900 text-left">
                                                        {songs.trackName}
                                                    </p>
                                                    <p className="mt-1 text-xs text-gray-500 text-left">
                                                        {songs.artistName}
                                                    </p>
                                                    <p className="mt-1 text-xs text-gray-500 text-left">
                                                        {songs.albumName}
                                                    </p>
                                                    <p className="mt-1 text-xs text-white font-bold bg-green-700 rounded-md p-1 w-16">
                                                        {songs.duration}
                                                    </p>
                                                </div>

                                                {/* Arrow Button */}
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        openDialog(songs)
                                                    }
                                                    className="shrink-0 inline-flex items-center justify-center rounded-2xl bg-white text-black px-3 py-2 font-black border-2 shadow-md hover:bg-indigo-700 hover:border-indigo-700 hover:text-white"
                                                >
                                                    →
                                                </button>
                                            </li>
                                        ))}
                                </ul>
                            </div>

                            {/* The Dialog */}
                            {selectedSong && (
                                <Dialog
                                    open={open}
                                    onClose={() => setOpen(false)}
                                    className="relative z-10"
                                >
                                    <DialogBackdrop className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                                    <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                                        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                                            <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                                                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                                    <div className="sm:flex sm:items-start">
                                                        <div className="mx-auto flex shrink-0 items-center justify-center rounded-xl bg-red-100 sm:mx-0 sm:h-10 sm:w-10 text-black font-bold text-sm">
                                                            <p className="p-2 mt-1">
                                                                Lyrics
                                                            </p>
                                                        </div>
                                                        <div className="mt-4 mb-2 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                                            <div className="overflow-y-auto w-full h-97 p-4 border border-gray-300 rounded-xl bg-gray-100 whitespace-pre-line space-y-2">
                                                                {selectedSong.syncedLyrics
                                                                    .split("\n")
                                                                    .map(
                                                                        (
                                                                            line,
                                                                            index,
                                                                            lyrics
                                                                        ) => (
                                                                            <button
                                                                                key={
                                                                                    index
                                                                                }
                                                                                className="w-full text-left p-2.5 m-1.5 text-black font-bold rounded-xl hover:bg-red-200"
                                                                                onClick={() =>
                                                                                    handleLyricClick(
                                                                                        line,
                                                                                        index,
                                                                                        selectedSong.syncedLyrics.split(
                                                                                            "\n"
                                                                                        ) // pass lyrics here
                                                                                    )
                                                                                }
                                                                            >
                                                                                {line.trim()}
                                                                            </button>
                                                                        )
                                                                    )}
                                                            </div>
                                                            <DialogTitle
                                                                as="h3"
                                                                className="text-base font-semibold text-gray-900 hidden"
                                                            >
                                                                Deactivate
                                                                account
                                                            </DialogTitle>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setOpen(false)
                                                        }
                                                        className="inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:w-auto"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </DialogPanel>
                                        </div>
                                    </div>
                                </Dialog>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default App;
