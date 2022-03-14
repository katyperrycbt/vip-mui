import React from 'react';

import { useRouter } from 'next/router';

import Layout from "@layouts";
import Meta from "@meta";
import PublicWordComponent from "@components/Words/Public";
import ErrorPage from "@components/Error";

import { API } from '@config';
import { deepExtractObjectStrapi, getNRelatedVips } from '@utils';
import { NO_PHOTO } from '@consts';

import qs from 'qs';
import _ from 'lodash';

const PublicWord = ({ vip, relatedVips, params }) => {
    const router = useRouter();

    if (router.isFallback || _.isEmpty(vip)) {
        return (
            <Layout tabName={"Private word"}>
                <ErrorPage
                    title="Word Not Found | VIP"
                    errorMessage="Not Found"
                    message="The word you are looking for does not exist."
                    illustration={NO_PHOTO}
                    redirectTo={{
                        title: "Dashboard",
                        link: "/dashboard",
                    }}
                />
            </Layout>
        )
    }

    return (
        <Layout noMeta tabName={vip?.vip}>
            <MetaTag vip={vip} params={params} />
            <PublicWordComponent vip={vip} params={params} relatedVips={relatedVips} />
        </Layout>
    );
};


const MetaTag = ({ vip, params }) => {
    
    const photo = vip?.illustration;
    const firstMeaning = vip?.meanings?.english[0] || vip?.meanings?.vietnamese[0];

    return (
        <Meta
            title={`${vip?.vip} - VIP`}
            description={firstMeaning}
            image={photo}
            url={`/word/public/${params?.id?.[0]}/${params?.id?.[1]}`}
            canonical={`/word/public/${params?.id?.[0]}/${params?.id?.[1]}`}
            publishedTime={vip?.createdAt}
            modifiedTime={vip?.updatedAt}
        />
    )
};

export async function getStaticPaths() {

    const querySearchRelated = {
        pagination: {
            page: 1,
            pageSize: 1000
        }
    }

    const res = await fetch(`${API}/api/vips?${qs.stringify(querySearchRelated, { encodeValuesOnly: true })}`);
    const data = (await res.json()).data;

    const paths = !!data?.length ? data.map(item => ({ params: { id: [item.attributes.vip, item.id.toString()] } })) : [];

    return {
        paths,
        fallback: 'blocking',
    };
}

export async function getStaticProps(ctx) {

    const { id: [vip, id] } = ctx.params;

    const foundVipRaw = await fetch(`${API}/api/vips/${id}?populate=*`);
    const foundVip = await foundVipRaw.json();

    const matchedVip = deepExtractObjectStrapi(foundVip, {
        minifyPhoto: ['illustration']
    });

    const randomSixRelatedVips = _.isObject(matchedVip) && !_.isEmpty(matchedVip) && await getNRelatedVips(matchedVip, 6);

    return {
        props: {
            vip: matchedVip,
            relatedVips: randomSixRelatedVips,
            params: ctx.params,
        },
        revalidate: 60
    }
}

export default PublicWord;