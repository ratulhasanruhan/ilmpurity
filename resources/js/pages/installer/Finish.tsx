import { Link } from '@inertiajs/react';
import { ReactNode } from 'react';
import Layout from './Partials/Layout';

const Finish = () => {
    return (
        <div className="text-center">
            <h6 className="mb-4 text-2xl font-medium">Setup complete</h6>
            <p className="mb-2">
                Your changed environment variables are set in the .env file now.
            </p>
            <p>
                <Link href="/" className="text-blue-500">
                    Click here
                </Link>{' '}
                to get back to your project.
            </p>
        </div>
    );
};

Finish.layout = (page: ReactNode) => <Layout children={page} />;

export default Finish;
