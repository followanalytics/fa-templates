import $ from 'jquery';
import _ from 'lodash';
import './css/main.scss';
import './css/style.scss';
import Assets from './assets/assets';
import {escapeHtml, checkSDKVersion} from './lib/utils';

const setActivePage = (index) => {
  currentPage = index;
  $('.page').each((_idx, node) => {
    node.removeAttribute('class');
    node.className = 'page';
  });
  for (let i = 0; i < totalPages; i++) {
    const page = $(`#page-${i}`);
    if (i < index) page.addClass('page--previous');
    if (i === index) page.addClass('page--current');
    if (i > index) page.addClass('page--next');
  }
}

let currentPage = 0;
let totalPages = 0;

(function () {
  // Global configs
  let inappClosed = false;
  const templateContainer = $('.template');

  // Total size = # of questionnaire pages + final page
  totalPages = _.size(FollowAnalyticsParams.pages) + 1;

  // Page configs
  const allPages = [...FollowAnalyticsParams.pages, ...FollowAnalyticsParams.final_page];
  _.forEach(allPages, (page, index) => {
    // Background config
    const pageContainer = $(`<div id="page-${index}" class="page" />`)
    pageContainer.css({backgroundColor: page.background.color});

    // Close button configs
    const closeButtonHtml = $('<div class="page__close">');
    closeButtonHtml.html(Assets.icoClose);
    closeButtonHtml.find('svg').css({fill: page.close_button.color});
    closeButtonHtml.on('click', () => {
      if (!inappClosed) {
        if (FollowAnalytics.CurrentCampaign.logAction) {
          FollowAnalytics.CurrentCampaign.logAction(`Page ${index + 1}: Dismiss`);
        }
        $('.deeplinkFrame').removeAttr('style');
        $('body').removeClass('overlay');
        $('body').find('.page__close').remove();
        setTimeout(() => FollowAnalytics.CurrentCampaign.close(), 700);
      }
    });
    pageContainer.append(closeButtonHtml);

    // Uploaded image config
    if (!!page.image.upload) {
      const imageHtml = $('<div class="page__image" />');
      imageHtml.css({
        backgroundImage: `url(${page.image.upload})`,
        display: 'flex',
      });
      pageContainer.append(imageHtml);
    }

    // Title text configs
    const titleContainer = $('<div class="page__title" />');
    const titleHtml = $('<span />');
    titleHtml.text(page.title.text);
    titleHtml.css({color: page.title.color});
    titleContainer.append(titleHtml);
    pageContainer.append(titleContainer);

    // Body text configs
    const bodyContainer = $('<div class="page__body" />');
    const bodyHtml = $('<span />');
    bodyHtml.html(escapeHtml(page.body.text));
    bodyHtml.css({color: page.body.color});
    bodyContainer.append(bodyHtml);
    pageContainer.append(bodyContainer);

    const buttonsContainer = $('<div class="page__buttons" />');
    _.forEach(page.buttons, (btn) => {
      const buttonHtml = $(`<div class="surveyButton">${btn.text}</div>`);
      buttonHtml.css({
        backgroundColor: btn.background,
        borderColor: btn.border,
        color: btn.text_color,
      });

      buttonHtml.on('click', (_event) => {
        if (FollowAnalytics.CurrentCampaign.logAction) {
          FollowAnalytics.CurrentCampaign.logAction(`Page ${index + 1}: ${btn.text}`);
        }
        // Close on last page clicks
        if (currentPage === totalPages - 1 && btn.deeplink_url !== '') {
          if (FollowAnalytics.getSDKVersion
            && typeof FollowAnalytics.getSDKVersion === 'function'
            && checkSDKVersion(FollowAnalytics.getSDKVersion(), 6, 3, 0)) {
            window.location.href = btn.deeplink_url;
          }
          else {
            const deeplinkIframe = $(`
              <iframe
                src="${btn.deeplink_url}"
                class="deeplinkFrame"
                sandbox="allow-same-origin allow-scripts"
                frameborder="0">
              </iframe>
            `);
            deeplinkIframe.on('load', () => {
              deeplinkIframe.css({transform: 'scale(1)'});
              // Wait for the animation of the iframe to end
              // Before showing the close button
              setTimeout(() => $('body').prepend(closeButtonHtml), 700);
            });
            $('body').prepend(deeplinkIframe);
          }
        }
        else if (currentPage === totalPages - 1 && !inappClosed) {
          inappClosed = true;
          $('body').removeClass('overlay');
          setTimeout(() => FollowAnalytics.CurrentCampaign.close(), 700);
        }
        // Otherwise go to next page
        else setActivePage(currentPage + 1);
      });
      buttonsContainer.append(buttonHtml);
    });
    pageContainer.append(buttonsContainer);

    // Page number config
    const pageNumberHtml = $(`<div class="page__pageNumber">${index + 1}/${totalPages}</div>`);
    pageNumberHtml.css({color: page.page_indicator.color});
    pageContainer.append(pageNumberHtml);

    templateContainer.append(pageContainer);
  });

  setActivePage(currentPage);
  setTimeout(() => $('body').addClass('overlay'), 400);
})();
