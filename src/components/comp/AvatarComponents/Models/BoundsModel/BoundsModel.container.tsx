import { useBounds } from "@react-three/drei";
import React, {
  FC,
  ReactElement,
  ReactNode,
  cloneElement,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { triggerCallback } from "@/services/avatar/index";
import { BaseModelProps } from "@/src/core/types/avatar";

export interface BoundsModelContainerProps extends BaseModelProps {
  modelSrc: string | Blob;
  children?: ReactNode | ReactNode[];
  fit?: boolean;
}

export const BoundsModelContainer: FC<BoundsModelContainerProps> = ({
  modelSrc,
  children,
  fit,
  onLoaded,
}) => {
  const bounds = useBounds();
  const [fallback, setFallback] = useState<JSX.Element>(<></>);

  const onChildLoaded = useCallback(() => {
    if (fit) {
      bounds.refresh().clip().fit();
    }

    triggerCallback(onLoaded);
  }, [bounds, fit, onLoaded]); // Added onLoaded to the dependency array

  const childModel = useMemo(
    () =>
      React.Children.map(children, (child) =>
        cloneElement(child as ReactElement, {
          setModelFallback: setFallback,
          onLoaded: onChildLoaded,
        })
      ),
    [children, onChildLoaded]
  );

  useEffect(() => {
    if (fit) {
      bounds.refresh().clip().fit();
    }
  }, [modelSrc, fit, fallback, bounds]); // Added bounds to the dependency array

  return <>{childModel}</>;
};
