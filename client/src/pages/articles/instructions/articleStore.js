import React from 'react';
import { Load } from '../../../components/code-splitting/LoadableComp';

const AsyncGiftVisibility = Load({ loader: () => import('./GiftVisibility_art1' /* webpackChunkName: "instru-article-page-lazy" */)});
const AsyncChallengeModes = Load({ loader: () => import('./ChallengeModes_art2' /* webpackChunkName: "instru-article-page-lazy" */)});

export const articleStore = {
    GiftVisibility_art1: <AsyncGiftVisibility />,
    ChallengeModes_art2: <AsyncChallengeModes />,
}