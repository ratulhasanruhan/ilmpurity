import { cn } from '@/lib/utils';

interface Props {
    step1?: string;
    step2?: string;
    step3?: string;
    step4?: string;
    step5?: string;
}

const StepCircle = ({ step, title }: { step: string; title: string }) => {
    return (
        <div className={`relative flex items-center text-red-500 ${step}`}>
            <div
                className={cn(
                    'h-4 w-4 rounded-full border-2 border-gray-300 transition duration-500 ease-in-out',
                    step === 'active' && 'border-orange-500',
                    step === 'fill' && 'border-orange-600 bg-orange-600',
                )}
            ></div>
            <p
                className={cn(
                    'absolute top-0 -ml-14 mt-6 w-32 text-center text-xs font-medium uppercase text-gray-500',
                    (step === 'active' || step === 'fill') && 'text-orange-500',
                )}
            >
                {title}
            </p>
        </div>
    );
};

const StepNavigator = (props: Props) => {
    const {
        step1 = '',
        step2 = '',
        step3 = '',
        step4 = '',
        step5 = '',
    } = props;

    return (
        <div className="mb-20 flex items-center px-6">
            <StepCircle step={step1} title="SERVER" />

            {/* Separator for Step 1 to Step 2 */}
            <div
                className={cn(
                    'flex-auto border-t-2 border-gray-300 transition duration-500 ease-in-out',
                    (step2 === 'active' || step2 === 'fill') &&
                        'border-orange-600',
                )}
            ></div>

            <StepCircle step={step2} title="SETTINGS" />

            {/* Separator for Step 2 to Step 3 */}
            <div
                className={cn(
                    'flex-auto border-t-2 border-gray-300 transition duration-500 ease-in-out',
                    (step3 === 'active' || step3 === 'fill') &&
                        'border-orange-600',
                )}
            ></div>

            <StepCircle step={step3} title="DATABASE" />

            {/* Separator for Step 3 to Step 4 */}
            <div
                className={cn(
                    'flex-auto border-t-2 border-gray-300 transition duration-500 ease-in-out',
                    (step4 === 'active' || step4 === 'fill') &&
                        'border-orange-600',
                )}
            ></div>

            <StepCircle step={step4} title="ADMIN" />

            {/* Separator for Step 4 to Step 5 */}
            <div
                className={cn(
                    'flex-auto border-t-2 border-gray-300 transition duration-500 ease-in-out',
                    (step5 === 'active' || step5 === 'fill') &&
                        'border-orange-600',
                )}
            ></div>

            <StepCircle step={step4} title="FINISH" />
        </div>
    );
};

export default StepNavigator;
