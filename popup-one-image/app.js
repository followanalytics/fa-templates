import $ from 'jquery';
import _ from 'lodash';
import './css/main.scss';
import './css/style.scss';
import Assets from './assets/assets';
import {handleConsoleMessage} from './lib/utils';
import {FollowAnalyticsWrapper} from './lib/FollowAnalyticsWrapper';

$(window).on('load', () => {
  try {
    const FollowAnalytics = new FollowAnalyticsWrapper().FollowAnalytics;
    if (FollowAnalyticsParams.background.image !== null) {
      $('.defaultTemplate__image').attr('src', `${FollowAnalyticsParams.background.image}`);

      let alreadyClosed = false;
      const closeButtonContainer = $('#templateClose');
      closeButtonContainer.html(Assets.icoClose);
      closeButtonContainer.find('svg').css({fill: FollowAnalyticsParams.close.color});
      closeButtonContainer.on('click', () => {
        if (!alreadyClosed) {
          alreadyClosed = true;
          if (FollowAnalytics.CurrentCampaign.logAction) FollowAnalytics.CurrentCampaign.logAction('Dismiss');
          FollowAnalytics.CurrentCampaign.close();
          $('#popupTemplate').removeClass('backdrop');
        }
      });
    }
  }
  catch (e) {
    handleConsoleMessage(e);
  }
});
