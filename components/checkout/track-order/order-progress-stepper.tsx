import { JSX, Fragment } from 'react';
import { CheckCircle } from 'lucide-react';
import { OrderStatus } from '@/app/api';
import { statusConfig, stepOrder } from './constants';

type OrderProgressStepperProps = {
  currentStatus: OrderStatus;
};

export const OrderProgressStepper = ({ currentStatus }: OrderProgressStepperProps): JSX.Element => {
  const steps = stepOrder.map((status) => ({ status, ...statusConfig[status] }));
  const currentIndex = steps.findIndex((step) => step.status === currentStatus);

  return (
    <div>
      <h3 className="mb-4 text-lg font-semibold text-gray-900">Order Progress</h3>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentIndex || currentIndex === steps.length - 1;
          const isCurrent = index === currentIndex;
          const iconElement = isCompleted ? (
            <CheckCircle className="h-5 w-5 text-green-600" />
          ) : (
            step.icon
          );

          let circleClass: string;
          let textColor: string;
          if (isCompleted) {
            circleClass = 'bg-green-100';
            textColor = 'text-green-600';
          } else if (isCurrent) {
            circleClass = 'bg-blue-100 animate-pulse';
            textColor = 'text-blue-600';
          } else {
            circleClass = 'bg-gray-100';
            textColor = 'text-gray-400';
          }

          let lineClass: string;
          if (index < steps.length - 1) {
            if (isCompleted) {
              lineClass = 'bg-green-500';
            } else {
              lineClass = 'bg-gray-300';
            }
          } else {
            lineClass = '';
          }

          return (
            <Fragment key={step.status}>
              <div className="flex flex-col items-center">
                <div className={`rounded-full p-3 ${circleClass}`}>{iconElement}</div>
                <p className={`mt-2 text-sm font-medium ${textColor}`}>{step.label}</p>
              </div>
              {index < steps.length - 1 && <div className={`h-0.5 flex-1 ${lineClass}`} />}
            </Fragment>
          );
        })}
      </div>
    </div>
  );
};
