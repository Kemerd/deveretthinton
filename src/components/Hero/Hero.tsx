import React, { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import { Corners } from '../Corners/Corners';
import { riseIn, EASE_OUT, EASE_SPRING, SCRAMBLE_CHARSET } from '../../styles/animations';
import { HERO_NAME, HERO_TAGLINE, HERO_BIO, RESUME_URL } from '../../data/portfolio';

/**
 * ============================================================================
 * Hero — the frosted-glass introduction panel at the top of the page.
 *
 * Layout: portrait photo on the left, name/tagline/bio on the right, and a
 * bottom rail with the resume button, Novabox ownership badge, and socials.
 * The name types itself in with a character-decode scramble on mount.
 * Elements stagger in with riseIn delays (0.1s → 0.45s).
 * ============================================================================
 */

interface HeroProps {
    /** Set false to skip the name scramble and render it instantly. */
    decodeAnim?: boolean;
}

/* Staggered entrance shared by every animated child of the panel */
const rise = (delay: number) => css`
    animation: ${riseIn} 0.7s ${EASE_OUT} ${delay}s both;
`;

/* The frosted-glass panel itself. Corners hang outside, so no overflow clip */
const Panel = styled.section`
    position: relative;
    background: linear-gradient(160deg, rgba(210, 224, 234, 0.1) 0%, rgba(15, 20, 26, 0.5) 35%, rgba(15, 20, 26, 0.6) 100%);
    backdrop-filter: blur(22px) saturate(160%);
    -webkit-backdrop-filter: blur(22px) saturate(160%);
    border: 1px solid rgba(168, 186, 201, 0.18);
    box-shadow: 0 18px 60px rgba(0, 0, 0, 0.4);
    padding: 32px;
    ${rise(0)}
`;

/* Photo + text sit side by side; stack them on narrow viewports */
const Row = styled.div`
    display: flex;
    gap: 36px;
    align-items: stretch;

    @media (max-width: 760px) {
        flex-direction: column;
        align-items: center;
    }
`;

/* Portrait frame with its own corner marks */
const PhotoFrame = styled.div`
    position: relative;
    flex-shrink: 0;
    width: 190px;
    height: 300px;
    border: 1px solid rgba(168, 186, 201, 0.35);
    ${rise(0.1)}
`;

const Photo = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    filter: saturate(0.92);
`;

/* Right-hand column, vertically centred against the photo */
const TextBlock = styled.div`
    flex: 1;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-height: 300px;

    @media (max-width: 760px) {
        min-height: 0;
        width: 100%;
    }
`;

/* Credentials chip pinned to the top-right of the text column */
const Credentials = styled.div`
    position: absolute;
    top: 6px;
    right: 10px;
    display: flex;
    align-items: center;
    gap: 10px;
    ${rise(0.4)}

    @media (max-width: 760px) {
        position: static;
        justify-content: flex-end;
        margin-bottom: 14px;
    }
`;

const CredentialLines = styled.span`
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 3px;
`;

const CredentialText = styled.span`
    font-family: 'IBM Plex Mono', monospace;
    font-size: 10px;
    letter-spacing: 2px;
    color: rgba(158, 178, 195, 0.65);
`;

/* Miniature reticle icon beside the credential text */
const MiniReticle = styled.div`
    position: relative;
    width: 26px;
    height: 26px;
    opacity: 0.55;
`;

const MiniReticleRing = styled.div`
    position: absolute;
    inset: 4px;
    border: 1px solid rgba(168, 186, 201, 0.35);
    border-radius: 50%;
`;

const MiniReticleH = styled.div`
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
    background: rgba(168, 186, 201, 0.5);
`;

const MiniReticleV = styled.div`
    position: absolute;
    left: 50%;
    top: 0;
    bottom: 0;
    width: 1px;
    background: rgba(168, 186, 201, 0.5);
`;

const NameBlock = styled.div`
    ${rise(0.15)}
`;

/* min-height reserves the line while the decode animation fills it in */
const Name = styled.h1`
    margin: 0 0 6px;
    font-family: 'SF Pro Display', system-ui, sans-serif;
    font-weight: 700;
    font-size: 46px;
    letter-spacing: -0.5px;
    line-height: 1.1;
    color: #F2F6F9;
    min-height: 51px;
`;

const Tagline = styled.h2`
    margin: 0 0 20px;
    font-family: 'IBM Plex Mono', monospace;
    font-weight: 400;
    font-size: 15px;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: rgba(158, 178, 195, 0.85);
`;

const Bio = styled.p`
    margin: 0;
    max-width: none;
    padding-right: 12px;
    font-size: 16.5px;
    line-height: 1.65;
    color: rgba(226, 234, 240, 0.88);
    ${rise(0.25)}
`;

/* Bottom rail: resume on the left, Novabox + socials on the right */
const Rail = styled.div`
    margin-top: 26px;
    padding-top: 22px;
    border-top: 1px solid rgba(168, 186, 201, 0.14);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
    ${rise(0.35)}

    @media (max-width: 760px) {
        flex-direction: column;
        align-items: stretch;
    }
`;

/* Resume download — bracketed button with a springy hover lift */
const ResumeButton = styled.a`
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 13px 24px;
    border: 1px solid rgba(168, 186, 201, 0.4);
    background: rgba(168, 186, 201, 0.08);
    font-family: 'IBM Plex Mono', monospace;
    font-size: 12px;
    letter-spacing: 2.5px;
    text-transform: uppercase;
    color: #DCE6ED;
    transition: background 0.18s ease, border-color 0.18s ease, transform 0.35s ${EASE_SPRING};

    i {
        font-size: 11px;
    }

    &:hover {
        background: rgba(168, 186, 201, 0.18);
        border-color: rgba(210, 224, 234, 0.7);
        color: #FFFFFF;
        transform: translateY(-2px);
    }

    &:active {
        transform: scale(0.93);
    }
`;

const RailRight = styled.div`
    display: flex;
    align-items: center;
    gap: 26px;

    @media (max-width: 760px) {
        justify-content: space-between;
    }
`;

/* Novabox ownership badge — logo with a soft glow plus two caption lines */
const NovaboxLink = styled.a`
    display: flex;
    align-items: center;
    gap: 10px;
    opacity: 0.9;
    transition: opacity 0.2s ease, transform 0.2s ease;

    &:hover {
        opacity: 1;
        transform: translateY(-2px);
    }
`;

const NovaboxLogo = styled.img`
    width: 28px;
    height: 28px;
    object-fit: contain;
    filter: drop-shadow(0 0 6px rgba(120, 150, 175, 0.4));
`;

const NovaboxText = styled.span`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
`;

const NovaboxTitle = styled.span`
    font-size: 12px;
    font-weight: 500;
    color: #E6ECF1;
`;

const NovaboxSub = styled.span`
    font-family: 'IBM Plex Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.5px;
    color: rgba(158, 178, 195, 0.75);
`;

const RailDivider = styled.div`
    width: 1px;
    height: 26px;
    background: rgba(168, 186, 201, 0.22);
`;

const Socials = styled.div`
    display: flex;
    gap: 18px;
`;

const SocialLink = styled.a`
    font-size: 19px;
    color: rgba(210, 222, 231, 0.8);
    transition: color 0.2s ease, transform 0.2s ease;

    &:hover {
        color: #FFFFFF;
        transform: translateY(-2px);
    }
`;

export const Hero: React.FC<HeroProps> = ({ decodeAnim = true }) => {
    // The visible name text — starts empty and scrambles toward HERO_NAME
    const [decoded, setDecoded] = useState(decodeAnim ? '' : HERO_NAME);

    /* Character-decode reveal: each 38ms frame reveals a little more of the
       real name while unrevealed slots churn through random glyphs. */
    useEffect(() => {
        if (!decodeAnim) return;
        let frame = 0;
        const total = 34;
        const timer = setInterval(() => {
            frame++;
            const revealed = Math.floor((frame / total) * HERO_NAME.length);
            let out = '';
            for (let i = 0; i < HERO_NAME.length; i++) {
                if (i < revealed) out += HERO_NAME[i];
                else if (HERO_NAME[i] === ' ') out += ' ';
                else out += SCRAMBLE_CHARSET[Math.floor(Math.random() * SCRAMBLE_CHARSET.length)];
            }
            if (frame >= total) {
                out = HERO_NAME;
                clearInterval(timer);
            }
            setDecoded(out);
        }, 38);
        return () => clearInterval(timer);
    }, [decodeAnim]);

    return (
        <Panel data-screen-label="Hero">
            <Corners />

            <Row>
                <PhotoFrame>
                    <Photo src="/img/pfp_16_9.png" alt={HERO_NAME} />
                    <Corners />
                </PhotoFrame>

                <TextBlock>
                    {/* Pilot certificates + citizenship, with a mini reticle */}
                    <Credentials>
                        <CredentialLines>
                            <CredentialText>FAA PPL IR LSRM</CredentialText>
                            <CredentialText>US Citizen</CredentialText>
                        </CredentialLines>
                        <MiniReticle>
                            <MiniReticleRing />
                            <MiniReticleH />
                            <MiniReticleV />
                        </MiniReticle>
                    </Credentials>

                    <NameBlock>
                        <Name>{decoded}</Name>
                        <Tagline>{HERO_TAGLINE}</Tagline>
                    </NameBlock>

                    <Bio>{HERO_BIO}</Bio>
                </TextBlock>
            </Row>

            <Rail>
                <div>
                    <ResumeButton href={RESUME_URL} target="_blank" rel="noopener noreferrer">
                        <i className="fas fa-download" />
                        <span>Download Resume</span>
                        <Corners size={9} color="#D3DFE9" />
                    </ResumeButton>
                </div>

                <RailRight>
                    <NovaboxLink href="https://novabox.works/" target="_blank" rel="noopener noreferrer">
                        <NovaboxLogo src="/img/novabox_logo.png" alt="Novabox" />
                        <NovaboxText>
                            <NovaboxTitle>Owner of Novabox.Works</NovaboxTitle>
                            <NovaboxSub>Open-Source Aerospace Engineering</NovaboxSub>
                        </NovaboxText>
                    </NovaboxLink>

                    <RailDivider />

                    <Socials>
                        <SocialLink href="https://www.instagram.com/ev.hinton/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                            <i className="fab fa-instagram" />
                        </SocialLink>
                        <SocialLink href="https://www.youtube.com/@everettengineers/videos" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                            <i className="fab fa-youtube" />
                        </SocialLink>
                        <SocialLink href="https://github.com/Kemerd" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                            <i className="fab fa-github" />
                        </SocialLink>
                        <SocialLink href="https://www.linkedin.com/in/deveretthinton/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                            <i className="fab fa-linkedin" />
                        </SocialLink>
                    </Socials>
                </RailRight>
            </Rail>
        </Panel>
    );
};
