import $ from 'jquery';
import _ from 'lodash';
import './css/style.scss';
import './css/main.scss';
import Assets from 'assets/assets';
import {handleConsoleMessage} from './lib/utils';
import {FollowAnalyticsWrapper} from './lib/FollowAnalyticsWrapper';

$(window).on('load', () => {
  try {
    const FollowAnalytics = new FollowAnalyticsWrapper().FollowAnalytics;
    if (typeof FollowAnalyticsParams === 'undefined') {
      throw {severity: 'warning', message: 'Missing template parameters, shutting down.'};
    }

    const mobilePortraitImage = $('.defaultTemplate__mobilePortrait');
    if (FollowAnalyticsParams.background.mobile_portrait !== null) {
      mobilePortraitImage.css({
        backgroundImage: `url(${FollowAnalyticsParams.background.mobile_portrait})`,
      });
    }
    const mobileLandscapeImage = $('.defaultTemplate__mobileLandscape');
    if (FollowAnalyticsParams.background.mobile_landscape !== null) {
      mobileLandscapeImage.css({
        backgroundImage: `url(${FollowAnalyticsParams.background.mobile_landscape})`,
      });
    }
    const tabletPortraitImage = $('.defaultTemplate__tabletPortrait');
    if (FollowAnalyticsParams.background.tablet_portrait !== null) {
      tabletPortraitImage.css({
        backgroundImage: `url(${FollowAnalyticsParams.background.tablet_portrait})`,
      });
    }
    const tabletLandscapeImage = $('.defaultTemplate__tabletLandscape');
    if (FollowAnalyticsParams.background.tablet_landscape !== null) {
      tabletLandscapeImage.css({
        backgroundImage: `url(${FollowAnalyticsParams.background.tablet_landscape})`,
      });
    }

    const closeButtonContainer = $('#templateClose');
    closeButtonContainer.html(Assets.icoClose);
    closeButtonContainer.find('svg').css({fill: FollowAnalyticsParams.close.color});
    closeButtonContainer.on('click', () => {
      if (FollowAnalytics.CurrentCampaign.logAction) FollowAnalytics.CurrentCampaign.logAction('Dismiss');
      FollowAnalytics.CurrentCampaign.close();
    });

    const deeplink_url = FollowAnalyticsParams.action.deeplink_url;
    const handleInterstitialClick = (_event) => {
      if (deeplink_url !== '') {
        if (FollowAnalytics.CurrentCampaign.logAction) FollowAnalytics.CurrentCampaign.logAction('Deeplink');
        if (FollowAnalyticsWrapper.checkMinSdkVersion(6, 3, 0)) {
          window.location.href = deeplink_url;
        }
        else {
          const deeplinkIframe = $(`
            <iframe
            src="${deeplink_url}"
            class="defaultTemplate__deeplinkFrame"
            sandbox="allow-same-origin allow-scripts"
            frameborder="0">
          </iframe>
          `);
          deeplinkIframe.on('load', () => {
            deeplinkIframe.css({'opacity': 1});
          })
          $('#interstitialTemplate').append(deeplinkIframe);
        }
      }
      else {
        if (FollowAnalytics.CurrentCampaign.logAction) FollowAnalytics.CurrentCampaign.logAction('Dismiss');
        FollowAnalytics.CurrentCampaign.close();
      }
    }
    // Add event listener for all backgrounds
    mobilePortraitImage.on('click', handleInterstitialClick);
    mobileLandscapeImage.on('click', handleInterstitialClick);
    tabletPortraitImage.on('click', handleInterstitialClick);
    tabletLandscapeImage.on('click', handleInterstitialClick);
  }
  catch (e) {
    handleConsoleMessage(e);
  }
});
