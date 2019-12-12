import $ from 'jquery';
import _ from 'lodash';
import './css/main.scss';
import './css/style.scss';
import Assets from './assets/assets';

(function () {
  if (FollowAnalyticsParams.background.image !== null) {
    $('.defaultTemplate__image').attr('src', `${FollowAnalyticsParams.background.image}`);

    const closeButtonContainer = $('#templateClose');
    closeButtonContainer.html(Assets.icoClose);
    closeButtonContainer.find('svg').css({fill: FollowAnalyticsParams.close.color});
    closeButtonContainer.on('click', () => {
      if (FollowAnalytics.CurrentCampaign.logAction) FollowAnalytics.CurrentCampaign.logAction('Dismiss');
      FollowAnalytics.CurrentCampaign.close();
      $('#popupTemplate').removeClass('backdrop');
    });
  }
})();
