import $ from 'jquery';
import _ from 'lodash';
import './css/main.scss';
import './css/style.scss';
import Assets from './assets/assets';
import SwipeManager from './lib/swiper';
import {escapeHtml, getIconDimensions, hexToRgb, handleConsoleMessage} from './lib/utils';
import {FollowAnalyticsWrapper} from './lib/FollowAnalyticsWrapper';

const CURRENT_PAGE_KEY = 'currentPage';
let currentPage = 0;
let lastPage = 0;

const setActivePage = (index) => {
  $('.pageContainer').each((_idx, node) => {
    node.removeAttribute('class');
    node.className = 'pageContainer';
  });
  for (let i = 0; i <= lastPage; i++) {
    const page = $(`#page-${i}`);
    if (i < index) page.addClass('pageContainer--previous');
    if (i === index) page.addClass('pageContainer--current');
    if (i > index) page.addClass('pageContainer--next');
  }

  $('.node').each((_idx, node) => {
    node.removeAttribute('style');
    const rgbaColor = hexToRgb(FollowAnalyticsParams.global_params.page_selector_color);
    if (node.getAttribute('id') === `node-${index}`) {
      $(node).css({
        backgroundColor: FollowAnalyticsParams.global_params.page_selector_color,
      });
    }
    else {
      $(node).css({
        backgroundColor: `rgba(${rgbaColor.r}, ${rgbaColor.g}, ${rgbaColor.b}, 0.4)`,
      });
    }
  });

  currentPage = index;
  if (typeof FollowAnalytics.CurrentCampaign.setData === 'function') {
    console.log(`Save page: ${index}`);
    FollowAnalytics.CurrentCampaign.setData(CURRENT_PAGE_KEY, index);
  }
}

const setUpSwipeCallbacks = (swipeManager) => {
  swipeManager.onLeft(() => {
    if (currentPage < lastPage) {
      setActivePage(++currentPage);
    }
  });
  swipeManager.onRight(() => {
    if (currentPage > 0) {
      setActivePage(--currentPage);
    }
  });
  swipeManager.run();
}

$(window).on('load', () => {
  try {
    const FollowAnalytics = new FollowAnalyticsWrapper().FollowAnalytics;
    if (typeof FollowAnalytics.CurrentCampaign.getData === 'function') {
      const savedPage = FollowAnalytics.CurrentCampaign.getData(CURRENT_PAGE_KEY);
      currentPage = savedPage || 0;
      if (!_.isUndefined(savedPage)) {
        console.log(`Fetched saved page: ${savedPage}`);
      }
    }
    if (typeof FollowAnalyticsParams === 'undefined') {
      throw {severity: 'warning', message: 'Missing template parameters, shutting down.'};
    }

    // Global configs
    const templateContainer = $('.multiScreenTemplate');
    templateContainer.css({
      fontFamily: FollowAnalyticsParams.global_params.font,
    });

    const pageSelector = $('<div class="pageSelector" />');
    _.forEach(FollowAnalyticsParams.pages, (_page, index) => {
      const pageNode = $(`<div class="nodeContainer"><div id="node-${index}" class="node" /></div>`)
        .on('click', () => {
          currentPage = index;
          setActivePage(index);
        });
      pageSelector.append(pageNode);
    });

    // Page configs
    lastPage = _.size(FollowAnalyticsParams.pages) - 1;
    _.forEach(FollowAnalyticsParams.pages, (page, index) => {
      const pageContainer = $(`<div id="page-${index}" class="pageContainer" />`)
      const swipeManager = new SwipeManager(pageContainer);
      setUpSwipeCallbacks(swipeManager);

      // Background configs
      const pageHtml = $('<div class="page" />');
      const pageContent = $('<div class="page__contents" />');
      pageHtml.append(pageContent);
      pageHtml.append(pageSelector.clone(true, true));
      pageHtml.css({
        backgroundColor: page.background.color,
        backgroundImage: `url(${page.background.image})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      });

      // Close button configs
      const closeButtonHtml = $('<div class="closeButton">');
      closeButtonHtml.html(Assets.icoClose);
      closeButtonHtml.find('svg').css({fill: page.close.color});
      closeButtonHtml.on('click', () => {
        if (FollowAnalytics.CurrentCampaign.logAction) {
          FollowAnalytics.CurrentCampaign.logAction(`Page ${index + 1} - Dismiss`);
        }
        FollowAnalytics.CurrentCampaign.close();
        $('#popupTemplate').removeClass('backdrop');
      });
      pageHtml.append(closeButtonHtml);

      // Uploaded image configs
      if (!!page.image.upload) {
        const imageHtml = $('<div class="page__image" />');
        imageHtml.css({
          backgroundImage: `url(${page.image.upload})`,
          display: 'flex',
        });
        pageContent.append(imageHtml);
      }

      // Title text configs
      const titleContainer = $('<div class="page__title" />');
      const titleHtml = $('<span />');
      titleHtml.text(page.title.text);
      titleHtml.css({
        fontSize: `${page.title.size}px`,
        color: page.title.color,
      });
      titleContainer.append(titleHtml);
      pageContent.append(titleContainer);

      // Icon configs
      if (page.icon.svg !== 'none') {
        const iconHtml = $('<div class="page__icon" />');
        const iconDimensions = getIconDimensions(page.icon.size);
        iconHtml.html(Assets[page.icon.svg]);
        iconHtml.find('svg').css({
          height: iconDimensions.height,
          width: iconDimensions.width,
          color: page.icon.color,
          fill: page.icon.color,
        });
        pageContent.append(iconHtml);
      }

      // Body text configs
      const bodyContainer = $('<div class="page__body" />');
      const bodyHtml = $('<span />');
      const newlineRegex = /(?:\r\n|\r|\n)/g;
      bodyHtml.html(escapeHtml(page.body.text).replace(newlineRegex, '<br>'));
      bodyHtml.css({
        fontSize: `${page.body.size}px`,
        color: page.body.color,
      });
      bodyContainer.append(bodyHtml);
      pageContent.append(bodyContainer);

      const buttonsContainer = $('<div class="page__buttons buttonGrid" />');
      _.forEach(page.buttons, (btn) => {
        const buttonWrapper = $('<div class="buttonCell"></div>');
        const buttonHtml = $(`<div class="actionButton">${btn.text}</div>`);
        buttonHtml.css({
          backgroundColor: btn.background,
          color: btn.font_color,
          fontSize: `${btn.font_size}px`,
        });

        buttonHtml.on('click', (_event) => {
          if (FollowAnalytics.CurrentCampaign.logAction) {
            FollowAnalytics.CurrentCampaign.logAction(`Page ${index + 1} - ${btn.text}`);
          }
          if (btn.deeplink_url !== '') {
            if (FollowAnalyticsWrapper.checkMinSdkVersion(6, 3, 0)) {
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
                deeplinkIframe.css({'opacity': 1});
                $('body').prepend(closeButtonHtml);
              });
              $('body').prepend(deeplinkIframe);
            }
          }
          else {
            FollowAnalytics.CurrentCampaign.close();
            $('#popupTemplate').removeClass('backdrop');
          }
        });

        buttonWrapper.append(buttonHtml);
        buttonsContainer.append(buttonWrapper);
      });
      pageContent.append(buttonsContainer);

      pageContainer.append(pageHtml);
      templateContainer.append(pageContainer);
    });

    setActivePage(currentPage);
  }
  catch (e) {
    handleConsoleMessage(e);
  }
});
