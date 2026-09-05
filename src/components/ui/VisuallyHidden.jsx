import React from 'react';

/**
 * VisuallyHidden — Block 4 / P4
 * Inline visually-hidden helper for screen-reader-only labels
 * attached to icon-only buttons, native controls, etc.
 */
export default function VisuallyHidden({ as: Tag = 'span', className, children, ...rest }) {
  return (
    <Tag
      className={className}
      style={{
        position: 'absolute',
        width: '1px',
        height: '1px',
        padding: 0,
        margin: '-1px',
        overflow: 'hidden',
        clip: 'rect(0,0,0,0)',
        whiteSpace: 'nowrap',
        border: 0,
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
}