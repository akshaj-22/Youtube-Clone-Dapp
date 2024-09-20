import { useLocation } from "react-router-dom";

const SearchResultsPage = () => {
  const location = useLocation();
  const { searchResults } = location.state;

  return (
    <div className="p-5">
      <h1 className="text-xl font-bold mb-4">Search Results</h1>
      {searchResults.length === 0 ? (
        <p>No videos found for your search query.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {searchResults.map((video, index) => (
            <div key={index} className="border p-4 rounded shadow-md">
              <h2 className="text-lg font-bold">{video.title}</h2>
              <p>{video.description}</p>
              <p><strong>Uploaded by:</strong> {video.uploader}</p>
              <p><strong>IPFS Hash:</strong> {video.ipfsHash}</p>
              <p><strong>Timestamp:</strong> {new Date(video.timestamp * 1000).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResultsPage;
