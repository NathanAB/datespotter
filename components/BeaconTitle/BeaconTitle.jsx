import React from 'react';
import InternalLink from 'next/link';
import ReactGA from 'react-ga';

import styles from './BeaconTitle.module.css';

export default function BeaconTitle() {
  return (
    <InternalLink href="/">
      <span
        onClick={() =>
          ReactGA.event({
            category: 'Interaction',
            action: 'Click Beacon Logo',
          })
        }
        className={styles.title}
      >
        BEACON
      </span>
    </InternalLink>
  );
}
