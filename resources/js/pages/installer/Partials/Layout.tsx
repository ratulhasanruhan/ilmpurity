import { PropsWithChildren } from 'react';

const Layout = ({ children }: PropsWithChildren) => {
    return (
        <div className="min-h-screen bg-gray-900 px-6 py-10">
            <div className="mx-auto w-full max-w-[750px] bg-white">
                <div className="bg-gray-100 p-6 md:p-10">
                    <h5 className="text-center text-3xl font-semibold">
                        App Installation
                    </h5>
                </div>

                <div className="p-6 md:p-10">{children}</div>
            </div>
        </div>
    );
};

export default Layout;
