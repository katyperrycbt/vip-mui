import React, { useEffect, useState } from 'react';

import { Paper, Typography, Grid, IconButton, Tooltip, Avatar } from '@mui/material';
import { Colors, Props, Fonts } from '@styles';
import _ from 'lodash';
import { UNSPLASH } from '@config';
import LoadingImage from '@components/LoadingImage';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import { UNSPLASH_LOGO_X } from '@consts';
import words from "@components/Words/words";

const RANDOM_QUERY = (word) => `https://api.unsplash.com/search/photos?query=${word}&per_page=1`;

const UnsplashWord = ({ width, unsplashVip }) => {
    const [img, setImg] = useState(unsplashVip?.photo?.results?.[0]);
    const [word, setWord] = useState(unsplashVip?.word);

    const [loading, setLoading] = useState(false);

    const blurDataURL = img?.blur_hash;
    const src = img?.urls?.regular;
    const author = img?.user?.name;
    const authorUrl = img?.user?.links?.html;
    const authorImg = img?.user?.profile_image?.small;
    const imgAlt = img?.alt_description;
    const downloadUrl = img?.links?.download;

    const run = async () => {
        setLoading(true);
        const randomWord = words[Math.floor(Math.random() * words.length)];
        setWord(randomWord);
        const res = await fetch(RANDOM_QUERY(randomWord), {
            headers: {
                Authorization: `Client-ID ${UNSPLASH}`
            }
        });
        const data = await res.json().catch(err => console.log(err));
        setImg(data);
        setLoading(false);
    }

    const handleRefresh = async () => {
        // if (_.isEmpty(img) && !loading) {
            await run();
        // }
    }

    return (
        <Paper sx={{
            width: width,
            height: width,
            maxWidth: 300,
            maxHeight: 300,
            borderRadius: '4px',
            overflow: 'hidden',
            position: 'relative',
        }}>
            <Tooltip title="Refresh">
                <IconButton
                    onClick={handleRefresh}
                    sx={{
                        color: Colors.BLUE_PUBLIC_WORDS,
                        position: 'absolute',
                        top: '0.5rem',
                        right: '0.5rem',
                        zIndex: 1,
                    }}
                    size="small"
                    // disabled={loading || !_.isEmpty(src)}
                >
                    <RefreshRoundedIcon fontSize="inherit" />
                </IconButton>
            </Tooltip>
            <Grid container {...Props.GCRCC}>
                <Grid item xs={12} {...Props.GICCC} sx={{
                    height: width / 2,
                    maxHeight: 150,
                    backgroundColor: Colors.WOAD_YELLOW, px: 2, py: 1,
                    position: 'relative',
                }}>
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: width,
                        height: width / 2,
                        maxHeight: 150,
                    }}>
                        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                            {src && <LoadingImage
                                src={src}
                                alt={imgAlt}
                                layout="fill"
                                placeholder="blue"
                                blurDataURL={blurDataURL}
                                objectFit="cover"
                                quality={100}
                            />}
                        </div>
                    </div>
                    <Typography variant="h4" sx={{
                        color: Colors.BLUE_PUBLIC_WORDS,
                        mt: 1,
                        zIndex: 1000,
                    }} className="overflowTypography">
                        {word?.toLowerCase()}
                    </Typography>
                </Grid>
                <Grid item xs={12} {...Props.GIRCC} sx={{ height: width / 2, maxHeight: 150, px: 2, py: 1 }} className="overflowTypography">
                    <Typography sx={{ color: (theme) => theme.palette.mainPublicWord.main, fontSize: Fonts.FS_16 }} align="center">
                        Powered by <LoadingImage
                            src={UNSPLASH_LOGO_X}
                            alt="Unsplash"
                            width={50}
                            height={20}
                            objectFit="contain"
                        />
                    </Typography>
                </Grid>
            </Grid>
        </Paper>
    );
};

export default UnsplashWord;