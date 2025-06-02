import Link from 'next/link';

export default function Home() {
    return (
        <div className="p-6 max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold mb-4">Welcome!</h1>
            <p className="mb-6">
                This site helps you explore the ground truth data created in the Job ads project (FWF P35783).
            </p>

            <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-2"><Link href="/explore">Data explorer</Link>
                </h2>
                <p className="text-gray-400">
                    This is a fuzzy search in the advertisement texts, accounting for slight variations in spellings. You will be able to view the advertrisements that contain your search terms along with which publication, issue and page number it was found in. Additionally you can click on a link to see the original image of the advertisement.
                </p>
            </div>
            <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-2"><Link href="/network">Network view</Link></h2>
                <p className="text-gray-400">
                    This view shows the adverisements (all or the the ads that match your search query) and the positions advertised in the advertisements as nodes. The ad nodes are connected to one or more position nodes as inferred from the ads. The network is also generated using a fuzzy search, so it will also include variations of the root term.
                </p>
                <p className='text-sm'><span className="font-semibold text-yellow-500">Note:</span>{' '}
                    <span className="text-gray-400">
                        Even though the text in the advertisements is considered ground truth, the positions themselves
                        have not been curated and may contain errors.
                    </span>
                </p>
            </div>

            <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-2"><Link href="/wordtree">Word-Tree view</Link></h2>
                <p className="text-gray-400">
                    Terms and their contexts are visualised across the entire corpus. A root term can be entered to generate a word tree that reveals how that term is used and how it branches out in different records. The word tree view shows all words in lowercase to ensure that the representation is case-insensitive.
                </p>
            </div>
        </div >
    );

}
