import React from 'react';
import { Load } from '../../../components/code-splitting/LoadableComp';

const AsyncGiftVisibility = Load({ loader: () => import('./GiftVisibility_art1' /* webpackChunkName: "instru-article-page-lazy" */)});

export const articleStore = {
    GiftVisibility_art1: <AsyncGiftVisibility />,
}