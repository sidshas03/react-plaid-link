import React, { useEffect, useRef, useMemo } from 'react';
import useScript from './react-script-hook';

import { PLAID_LINK_STABLE_URL } from './constants';
import {
  PlaidEmbeddedLinkPropTypes,
  PlaidLinkOptionsWithLinkToken,
} from './types';
import { applyEmbeddedSandboxFix, isSandboxMode } from './sandbox-fix';

export const PlaidEmbeddedLink = (props: PlaidEmbeddedLinkPropTypes) => {
  const {
    style,
    className,
    onSuccess,
    onExit,
    onLoad,
    onEvent,
    token,
    receivedRedirectUri,
  } = props;

  const config = useMemo<PlaidLinkOptionsWithLinkToken>(
    () => ({
      onSuccess,
      onExit,
      onLoad,
      onEvent,
      token,
      receivedRedirectUri,
    }),
    [onSuccess, onExit, onLoad, onEvent, token, receivedRedirectUri]
  );

  // Asynchronously load the plaid/link/stable url into the DOM
  const [loading, error] = useScript({
    src: PLAID_LINK_STABLE_URL,
    checkForExisting: true,
  });

  const embeddedLinkTarget = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    // If the external link JS script is still loading, return prematurely
    if (loading) {
      return;
    }

    if (error || !window.Plaid) {
      // eslint-disable-next-line no-console
      console.error('Error loading Plaid', error);
      return;
    }

    if (config.token == null || config.token == '') {
      console.error('A token is required to initialize embedded Plaid Link');
      return;
    }

    // Apply sandbox fix for embedded links
    applyEmbeddedSandboxFix();

    // The embedded Link interface doesn't use the `usePlaidLink` hook to manage
    // its Plaid Link instance because the embedded Link integration in link-initialize
    // maintains its own handler internally.
    const { destroy } = window.Plaid.createEmbedded(
      { ...config }, embeddedLinkTarget.current as HTMLElement
    );

    // Clean up embedded Link component on unmount
    return () => {
      destroy();
    }
  }, [loading, error, config, embeddedLinkTarget]);

  // Combine className with sandbox fix class if in sandbox mode
  const combinedClassName = isSandboxMode() 
    ? `${className || ''} plaid-embedded-link`.trim()
    : className;

  return (
    <div style={style} className={combinedClassName} ref={embeddedLinkTarget}></div>
  );
};

export default PlaidEmbeddedLink;
