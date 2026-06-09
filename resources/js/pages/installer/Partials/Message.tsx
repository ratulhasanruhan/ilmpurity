interface Props {
    success?: string;
    error?: string;
}

const Message = ({ success, error }: Props) => {
    return (
        <div>
            {success && (
                <div className="mb-4 rounded-md bg-green-100 px-5 py-3 text-center text-sm text-green-500">
                    {success}
                </div>
            )}

            {error && (
                <div className="mb-4 rounded-md bg-red-100 px-5 py-3 text-center text-sm text-red-500">
                    {error}
                </div>
            )}
        </div>
    );
};

export default Message;
