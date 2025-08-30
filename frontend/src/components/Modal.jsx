const Modal = ({ isOpen, onClose, children }) => {
    return (
      <>
        {isOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            {/* Background overlay */}
            <div className="fixed inset-0 bg-black bg-opacity-80"></div>
  
            {/* Modal content */}
            <div className="relative w-11/12 max-w-2xl bg-[#141414] p-6 rounded-lg shadow-xl z-10 transform transition-transform duration-300 ease-in-out text-white overflow-hidden">
              {/* Close button */}
              <button
                className="absolute top-4 right-4 text-gray-300 hover:text-red-600 transition duration-200 focus:outline-none"
                onClick={onClose}
                aria-label="Close modal"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
  
              {/* Modal Header */}
              <div className="mb-4 border-b border-gray-700 pb-4">
                <h2 className="text-2xl font-bold">Update/Delete Genre</h2>
              </div>
  
              {/* Modal content passed as children */}
              <div className="mt-4 max-h-[60vh] overflow-y-auto">
                {children}
              </div>
  
              {/* Modal Footer */}
              <div className="flex justify-end mt-6 border-t border-gray-700 pt-4">
                <button
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded"
                  onClick={onClose}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  };
  
  export default Modal;
  