import React from 'react';
import styled from 'styled-components';
import { Corners } from '../Corners/Corners';
import { riseIn, EASE_OUT, EASE_SPRING } from '../../styles/animations';
import { ViewId, VIEW_ORDER } from '../../data/portfolio';

/**
 * ============================================================================
 * ViewTabs — the segmented control that switches between the four sections.
 *
 * A translucent pill slides beneath the active tab. The pill's easing curve
 * is context-sensitive: it overshoots playfully between the middle tabs but
 * switches to a non-overshooting curve at the outer tabs so it never pokes
 * past the container edge.
 * ============================================================================
 */

interface ViewTabsProps {
    /** Currently active view. */
    view: ViewId;
    /** Called with the tapped view id (already-active taps are ignored). */
    onSelect: (view: ViewId) => void;
    /** Per-tab width in px — 150 on desktop, shrunk by App on small screens. */
    tabWidth?: number;
}

/* Overshooting spring for middle-tab travel */
const PILL_EASE_SPRING = 'cubic-bezier(0.3, 1.65, 0.5, 1)';

/* Softer curve for travel that ends at the first or last tab */
const PILL_EASE_EDGE = 'cubic-bezier(0.2, 0.9, 0.3, 1)';

/* Centres the control below the hero */
const Wrap = styled.div`
    display: flex;
    justify-content: center;
    padding: 44px 0 8px;
    animation: ${riseIn} 0.7s ${EASE_OUT} 0.45s both;
`;

/* Frosted-glass track holding the four buttons and the pill */
const Track = styled.div`
    position: relative;
    display: inline-flex;
    border: 1px solid rgba(168, 186, 201, 0.2);
    background: rgba(13, 17, 22, 0.6);
    backdrop-filter: blur(20px) saturate(150%);
    -webkit-backdrop-filter: blur(20px) saturate(150%);
`;

/* The sliding highlight. Position + easing arrive via inline style since
   they change with the active tab; everything static lives here. */
const Pill = styled.div`
    position: absolute;
    top: 3px;
    bottom: 3px;
    background: rgba(190, 205, 218, 0.13);
    border: 1px solid rgba(190, 205, 218, 0.2);
    box-sizing: border-box;
    z-index: 0;
`;

const TabButton = styled.button<{ $active: boolean }>`
    position: relative;
    z-index: 1;
    padding: 14px 0;
    border: none;
    cursor: pointer;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 12px;
    letter-spacing: 2.5px;
    text-transform: uppercase;
    background: transparent;
    transition: color 0.2s ease, transform 0.35s ${EASE_SPRING};
    color: ${({ $active }) => ($active ? '#FFFFFF' : 'rgba(215, 226, 235, 0.55)')};

    &:hover {
        color: #FFFFFF;
        transform: translateY(-1px);
    }

    &:active {
        transform: scale(0.9);
    }
`;

export const ViewTabs: React.FC<ViewTabsProps> = ({ view, onSelect, tabWidth = 150 }) => {
    const viewIdx = VIEW_ORDER.indexOf(view);

    // Edge tabs get the non-overshooting curve so the pill stays inside
    const pillEase = viewIdx === 0 || viewIdx === VIEW_ORDER.length - 1 ? PILL_EASE_EDGE : PILL_EASE_SPRING;

    return (
        <Wrap>
            <Track>
                <Corners />
                <Pill
                    style={{
                        width: tabWidth - 6,
                        left: viewIdx * tabWidth + 3,
                        transition: `left 0.38s ${pillEase}`,
                    }}
                />
                {VIEW_ORDER.map((id) => (
                    <TabButton
                        key={id}
                        $active={view === id}
                        style={{ width: tabWidth }}
                        onClick={() => onSelect(id)}
                    >
                        {id.charAt(0).toUpperCase() + id.slice(1)}
                    </TabButton>
                ))}
            </Track>
        </Wrap>
    );
};
