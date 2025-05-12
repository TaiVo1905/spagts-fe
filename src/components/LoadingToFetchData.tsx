const LoadingToFetchData = () => {
    return (
        <div className="flex items-center justify-center w-full flex-col">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-(--primary-color)"></div>
                <span className="pt-3 text-(--primary-color) text-bold text-lg">Waiting a few seconds!</span>
        </div>
    )
}

export default LoadingToFetchData;