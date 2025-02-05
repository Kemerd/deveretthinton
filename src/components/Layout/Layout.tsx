import React from 'react';
import styled from 'styled-components';
import { AppTheme } from '../../theme/theme';
import { FrostedGlass } from '../FrostedGlass/FrostedGlass';

const BackgroundContainer = styled.div`
    min-height: 100vh;
    background: url('/img/bg.jpg') no-repeat center center fixed;
    background-size: cover;
    position: relative;
    color: ${AppTheme.colors.light.textPrimary};

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(
            to bottom,
            rgba(0, 0, 0, 0.7) 0%,
            rgba(0, 0, 0, 0.5) 100%
        );
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
    }
`;

const ContentContainer = styled.div`
    position: relative;
    max-width: 1400px;
    margin: 0 auto;
    padding: ${AppTheme.spacing[32]};
`;

const Header = styled(FrostedGlass)`
    margin-bottom: ${AppTheme.spacing[32]};
    padding: ${AppTheme.spacing[32]};
    border-radius: ${AppTheme.radius.large};
`;

const HeaderContent = styled.div`
    display: flex;
    gap: ${AppTheme.spacing[32]};
    position: relative;
`;

const ContentWrapper = styled.div`
    flex: 1;
    position: relative;
    height: 284px;
    display: flex;
    align-items: center;
`;

const TextContainer = styled.div`
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-top: 8px;
    
    & > * {
        transform: translateY(2px);
    }
`;

const ProfilePicture = styled(FrostedGlass)`
    width: 160px;
    height: 284px;
    flex-shrink: 0;
    border-radius: ${AppTheme.radius.large};
    overflow: hidden;
    padding: 0;
    
    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center;
        border-radius: inherit;
        margin: 0;
        display: block;
        transform: translate3d(0, 0, 0);
        will-change: transform;
        image-rendering: auto;
        
        filter: brightness(1.0) contrast(1.0);
        
        backface-visibility: hidden;
        -webkit-backface-visibility: hidden;
        -moz-backface-visibility: hidden;
        
        -webkit-transform-style: preserve-3d;
        transform-style: preserve-3d;
    }
`;

const HeaderText = styled.div`
    max-width: 800px;
`;

const Name = styled.h1`
    ${AppTheme.typography.heroDisplay};
    color: ${AppTheme.colors.light.textPrimary};
    margin: 0 0 ${AppTheme.spacing[8]};
`;

const Title = styled.h2`
    ${AppTheme.typography.title1};
    color: ${AppTheme.colors.light.textSecondary};
    margin: 0 0 ${AppTheme.spacing[24]};
`;

const Bio = styled.p`
    ${AppTheme.typography.body};
    color: ${AppTheme.colors.light.textPrimary};
    max-width: 800px;
    margin: 0;
    padding-bottom: ${AppTheme.spacing[32]};
`;

const SocialLinks = styled.div`
    display: flex;
    gap: ${AppTheme.spacing[16]};
    position: absolute;
    top: 0;
    right: 0;
`;

const SocialIcon = styled.a`
    color: ${AppTheme.colors.light.textPrimary};
    font-size: 24px;
    transition: transform 0.3s ease;
    &:hover {
        transform: translateY(-2px);
    }
`;

const DownloadButton = styled(FrostedGlass)`
    position: absolute;
    bottom: ${AppTheme.spacing[32]};
    right: 0;
    padding: 0;
    cursor: pointer;
    height: 28px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: ${AppTheme.spacing[4]};
    transition: all 0.2s ease;
    width: auto;
    min-width: 140px;

    /* Enhanced glass effect */
    background: rgba(255, 255, 255, 0.08) !important;
    backdrop-filter: blur(10px) !important;

    /* Typography adjustments */
    ${AppTheme.typography.button};
    font-size: 13px;
    letter-spacing: 0.2px;

    &:hover {
        transform: translateY(-2px);
        background: rgba(255, 255, 255, 0.12) !important;
    }

    &:active {
        transform: translateY(0);
    }
`;

const ButtonContent = styled.div`
    display: flex;
    align-items: center;
    gap: ${AppTheme.spacing[4]};
    padding: ${AppTheme.spacing[2]} ${AppTheme.spacing[4]};
`;

const ButtonText = styled.span`
    font-family: ${AppTheme.typography.body.fontFamily};
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.3px;
    line-height: 1.2;
    color: ${AppTheme.colors.light.textPrimary};
`;

const ButtonIcon = styled.i`
    font-size: 11px;
    color: ${AppTheme.colors.light.textPrimary};
`;

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const handleDownload = () => {
        // Add your resume download logic here
        window.open('/resume.pdf', '_blank');
    };

    return (
        <BackgroundContainer>
            <ContentContainer>
                <Header>
                    <HeaderContent>
                        <ProfilePicture
                            $blurIntensity={5}
                            $glowIntensity={0.2}
                            $enableGlow={true}
                            $enableAnimatedGradient={true}
                            $padding={AppTheme.spacing[16]}
                        >
                            <img
                                src="/img/pfp_16_9.png"
                                alt="D Everett Hinton"
                                loading="eager"
                                decoding="sync"
                                draggable="false"
                            />
                        </ProfilePicture>
                        <ContentWrapper>
                            <TextContainer>
                                <HeaderText>
                                    <Name>D Everett Hinton</Name>
                                    <Title>Senior Software Engineer & Pilot</Title>
                                    <Bio>
                                        I'm Everett, a results-driven professional and a software expert.
                                        With over 10+ years of experience across full-stack development, enterprise,
                                        film & VFX, & games— I excel at turning cross-disciplinary, ambitious
                                        ideas into reality and ensuring projects cross the finish line. Once
                                        described as 'a one man wrecking crew' by an EP, when I'm not shipping
                                        features, I'm in the hangar building planes or in the cockpit flying—bringing
                                        the same discipline & passion to the skies as I do to my work.
                                    </Bio>
                                </HeaderText>
                                <SocialLinks>
                                    <SocialIcon href="https://www.instagram.com/" target="_blank">
                                        <i className="fab fa-instagram" />
                                    </SocialIcon>
                                    <SocialIcon href="https://www.youtube.com/@everettengineers/videos" target="_blank">
                                        <i className="fab fa-youtube" />
                                    </SocialIcon>
                                    <SocialIcon href="https://github.com/Kemerd" target="_blank">
                                        <i className="fab fa-github" />
                                    </SocialIcon>
                                    <SocialIcon href="https://www.linkedin.com/" target="_blank">
                                        <i className="fab fa-linkedin" />
                                    </SocialIcon>
                                </SocialLinks>
                                <DownloadButton
                                    $blurIntensity={10}
                                    $borderRadius={AppTheme.radius.medium}
                                    $padding={AppTheme.spacing[8]}
                                    $enableGlow={true}
                                    $glowIntensity={0.3}
                                    onClick={handleDownload}
                                >
                                    <ButtonContent>
                                        <ButtonIcon className="fas fa-download" />
                                        <ButtonText>Download Resume</ButtonText>
                                    </ButtonContent>
                                </DownloadButton>
                            </TextContainer>
                        </ContentWrapper>
                    </HeaderContent>
                </Header>
                {children}
            </ContentContainer>
        </BackgroundContainer>
    );
}; 