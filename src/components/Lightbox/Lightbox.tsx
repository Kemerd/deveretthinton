import React, { useEffect } from 'react';
import styled from 'styled-components';
import { Corners } from '../Corners/Corners';
import { fadeIn, panelIn, EASE_OUT, EASE_SPRING } from '../../styles/animations';

/**
 * ============================================================================
 * Lightbox — fullscreen zoom view for the detail panel photos.
 *
 * Clicking the scrim (or pressing Escape) closes it; the chevrons and the
 * arrow keys step through the hovered item's three photos. The framed image
 * itself swallows clicks so it can't accidentally dismiss the overlay.
 * ============================================================================
 */

interface LightboxProps {
    /** Image set being browsed. */
    images: string[];
    /** Index of the image currently shown. */
    index: number;
    onClose: () => void;
    /** Step forward (+1) or back (-1), wrapping at the ends. */
    onStep: (dir: number) => void;
}

/* Fullscreen blurred scrim — clicking anywhere on it closes the lightbox */
const Scrim = styled.div`
    position: fixed;
    inset: 0;
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(8, 11, 15, 0.72);
    backdrop-filter: blur(22px) saturate(150%);
    -webkit-backdrop-filter: blur(22px) saturate(150%);
    animation: ${fadeIn} 0.2s ease both;
    cursor: zoom-out;
`;

/* Shared styling for the three control buttons */
const ControlButton = styled.button`
    position: absolute;
    width: 42px;
    height: 42px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(16, 21, 27, 0.6);
    border: 1px solid rgba(168, 186, 201, 0.35);
    color: rgba(220, 230, 238, 0.9);
    font-size: 14px;
    cursor: pointer;
    z-index: 2;
    transition: transform 0.35s ${EASE_SPRING}, background 0.2s ease;

    &:hover {
        background: rgba(168, 186, 201, 0.18);
        transform: scale(1.08);
    }

    &:active {
        transform: scale(0.86);
    }
`;

const PrevButton = styled(ControlButton)`
    left: 28px;
    top: 50%;
    margin-top: -21px;
`;

const NextButton = styled(ControlButton)`
    right: 28px;
    top: 50%;
    margin-top: -21px;
`;

const CloseButton = styled(ControlButton)`
    top: 28px;
    right: 28px;
    font-size: 16px;
`;

/* Bordered frame around the zoomed image, with corner marks */
const Frame = styled.div`
    position: relative;
    padding: 10px;
    background: rgba(11, 15, 20, 0.8);
    border: 1px solid rgba(190, 205, 218, 0.4);
    animation: ${panelIn} 0.25s ${EASE_OUT} both;
    cursor: default;
`;

/* The photo itself, letterboxed to fit within 88% of the viewport */
const Zoomed = styled.img`
    display: block;
    max-width: calc(88vw - 20px);
    max-height: calc(88vh - 20px);
    object-fit: contain;
`;

export const Lightbox: React.FC<LightboxProps> = ({ images, index, onClose, onStep }) => {
    /* Keyboard driving: Escape closes, arrows step. Bound only while open
       since this component unmounts with the lightbox. */
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowLeft') onStep(-1);
            if (e.key === 'ArrowRight') onStep(1);
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [onClose, onStep]);

    return (
        <Scrim onClick={onClose}>
            <PrevButton
                aria-label="Previous image"
                onClick={(e) => {
                    e.stopPropagation();
                    onStep(-1);
                }}
            >
                <i className="fas fa-chevron-left" />
            </PrevButton>
            <NextButton
                aria-label="Next image"
                onClick={(e) => {
                    e.stopPropagation();
                    onStep(1);
                }}
            >
                <i className="fas fa-chevron-right" />
            </NextButton>
            <CloseButton aria-label="Close" onClick={onClose}>
                <i className="fas fa-xmark" />
            </CloseButton>

            {/* stopPropagation keeps clicks on the frame from closing */}
            <Frame onClick={(e) => e.stopPropagation()}>
                <Corners color="#D8E2EC" />
                <Zoomed src={images[index]} alt="" />
            </Frame>
        </Scrim>
    );
};
