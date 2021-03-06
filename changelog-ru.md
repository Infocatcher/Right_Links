﻿#### Right Links: История изменений

`+` – добавлено<br>
`-` – удалено<br>
`x` – исправлено<br>
`*` – улучшено<br>

##### master/HEAD
`+` Добавлена болгарская локаль (bg), спасибо <a href="https://github.com/spacy01">Peyu Yovev</a> (<a href="https://github.com/Infocatcher/Right_Links/pull/34">#34</a>, <a href="https://github.com/Infocatcher/Right_Links/pull/35">#35</a>, <a href="https://github.com/Infocatcher/Right_Links/pull/36">#36</a>).<br>
`*` Пункты «Сообщать о…» блокируются, если уведомления отключены глобально (<em>extensions.rightlinks.notifyOpenTime</em> = -1).<br>

##### 0.4.1 (2017-05-16)
`x` Исправлено поддельное событие «mouseup» в мультипроцессном режиме (<em>extensions.rightlinks.fakeMouseup</em> = true).<br>
`x` Подкорректирован долгий клик левой кнопкой мыши в мультипроцессном режиме: увеличено время ожидания для остановки события click (настройка <em>extensions.rightlinks.e10sWaitDelay</em>).<br>
`+` Добавлена возможность открыть оригинальное контекстное меню браузера с помощью клика правой кнопкой мыши с любой клавишей-модификатором на кнопке и пункте меню от Right Links.<br>
`x` Исправлено определение ссылок в CSS инспекторе в Firefox 52+.<br>
`x` Исправлено повторное включение в мультипроцессном режиме: теперь повторно используются уже загруженные скрипты (см. <a href="https://bugzilla.mozilla.org/show_bug.cgi?id=1051238">bug 1051238</a>).<br>

##### 0.4.0 (2017-01-30)
`+` Добавлена немецкая локаль (de), спасибо <a href="https://github.com/milupo">milupo</a> (<a href="https://github.com/Infocatcher/Right_Links/issues/18">#18</a>).<br>
`+` Добавлена возможность игнорировать <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas">canvas</a> изображения (настройки <em>extensions.rightlinks.enabledOnCanvasImages</em> и <em>extensions.rightlinks.enabledOnCanvasImages.sizeLimit</em>, например, для отключения в случае проблем с производительностью).<br>
`*` Долгий клик левой кнопкой мыши: добавлена отправка поддельного события «mouseup» в документ вкладки для лучшей совместимости со скриптами страниц (настройка <em>extensions.rightlinks.fakeMouseup.content</em>).<br>
`+` Добавлены раздельные настройки для открытия закладок в фоне (<em>extensions.rightlinks.loadBookmarksInBackground</em> и <em>extensions.rightlinks.loadBookmarksInBackground.left</em>).<br>
`+` Добавлен `rightLinks.handledItem` API для других расширений.<br>
`+` Добавлены скрытые настройки для открытия ссылок в текущей вкладке (<em>extensions.rightlinks.loadIn</em> и <em>extensions.rightlinks.loadIn.left</em>, <a href="https://github.com/Infocatcher/Right_Links/issues/20">#20</a>).<br>
`*` Теперь используется более быстрый `canvas.toBlob()` вместо `canvas.toDataURL()` для <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas">canvas</a> (настройка <em>extensions.rightlinks.enabledOnCanvasImages.useBlob</em>) (<a href="https://github.com/Infocatcher/Right_Links/issues/25">#25</a>).<br>
`+` Добавлен запрос подтверждения при первом отключении клавишей F2 (<em>extensions.rightlinks.enabled.confirmHotkey</em> preference) (<a href="https://github.com/Infocatcher/Right_Links/issues/26">#26</a>).<br>
`x` Добавлена поддержка мультипроцессного режима (Electrolysis aka e10s) (<a href="https://github.com/Infocatcher/Right_Links/issues/17">#17</a>, <a href="https://github.com/Infocatcher/Right_Links/issues/21">#21</a>).<br>
`x` Исправлена совместимость с будущими версиями Firefox: прекращено использование Array generics вида `Array.forEach()` и String generics вида `String.startsWith()` (<a href="https://bugzilla.mozilla.org/show_bug.cgi?id=1222547">bug 1222547</a>, <a href="https://bugzilla.mozilla.org/show_bug.cgi?id=1222552">bug 1222552</a>).<br>

##### 0.3.8.4 (2014-08-10)
`x` Исправлено: долгий клик левой кнопкой мыши открывал старую ссылку, если ссылка менялась (<a href="https://github.com/Infocatcher/Right_Links/issues/9">#9</a>).<br>
`+` Добавлена поддержка расширения <a href="https://addons.mozilla.org/addon/feed-sidebar/">Feed Sidebar</a> (<a href="https://github.com/Infocatcher/Right_Links/issues/12">#12</a>).<br>
`*` Галочка «Показывать в строке состояния» теперь скрыта в Firefox 29+, если строка состояния не восстановлена другим расширением.<br>
`x` Workaround для конфликта с расширением <a href="https://addons.mozilla.org/addon/multi-links/">Multi Links</a> (<a href="https://github.com/Infocatcher/Right_Links/issues/13">#13</a>).<br>

##### 0.3.8.3 (2014-02-09)
`x` Исправлен конфликт с расширением <a href="https://addons.mozilla.org/addon/informenter/">InFormEnter</a>: иконки после текстовых полей не работали (<a href="https://github.com/Infocatcher/Right_Links/issues/4">#4</a>).<br>
`*` Немного улучшена производительность при запуске.<br>
`x` Исправлено определение XUL-ссылок в Firefox 26+ (<a href="https://github.com/Infocatcher/Right_Links/issues/5">#5</a>).<br>
`x` Исправлено определение ссылок в CSS инспекторе в Firefox 22+ (<a href="https://github.com/Infocatcher/Right_Links/issues/6">#6</a>).<br>
`x` Исправлен автоматический выбор первого пункта, если меню настроек было открыто с помощью клавиатуры (по умолчанию Alt+F2) в Firefox 25+.<br>
`+` Добавлена поддержка любых деревьев с закладками/историей (<a href="https://github.com/Infocatcher/Right_Links/issues/7">#7</a>).<br>
`+` Добавлена поддержка истории внутри кнопки-меню в Australis.<br>
`x` Исправлено определение пунктов меню «Открыть …» RSS-закладок в Firefox 4+.<br>

##### 0.3.8.2 (2013-08-22)
`*` Расширение больше не упаковывается в <a href="https://developer.mozilla.org/en-US/docs/Extensions/Updating_extensions_for_Firefox_4#XPI_unpacking">дополнительный JAR-архив</a>.<br>
`x` Исправлено: настоящие ссылки, выглядящие заглушками, могли открываться в текущей вкладке (<a href="https://github.com/Infocatcher/Right_Links/issues/1">#1</a>).<br>
`x` Исправлено: вкладки становились некликабельными после открытия любой ссылки с обработчиками кликов (настройка <em>extensions.rightlinks.workaroundForMousedownImitation</em>) (<a href="https://github.com/Infocatcher/Right_Links/issues/2">#2</a>).<br>

##### 0.3.8.1 (2013-04-14)
`*` Улучшено: вкладки больше не используются во всплывающих окнах (как в самом Firefox) (настройка <em>extensions.rightlinks.dontUseTabsInPopupWindows</em>).<br>
`*` Используется событие "dragstart" вместо deprecated "draggesture" (если доступно).<br>
`*` Улучшено: добавлена остановка события "dragstart" после долгого клика левой кнопкой мыши.<br>
`*` Подкорректировано положение пункта в меню Инструменты в последних версиях Firefox Nightly.<br>
`+` Теперь вы можете использовать <em>extensions.rightlinks.filesLinksPolicy</em> = 3 для копирования ссылки.<br>
`x` Workaround для генерируемого события "mousedown" в расширении <a href="https://addons.mozilla.org/firefox/addon/budaneki/">budaneki</a>.<br>

##### 0.3.8 (2013-01-04)
`*` Улучшен механизм временного отключения: отключенное расширение теперь обрабатывает только необходимый минимум событий.<br>
`x` Исправлено открытие ссылок "долгим" кликом левой кнопкой мыши при использовании расширений для жестов мышью.<br>
`*` Добавлено прекращение обработки кликов при прокрутке мышкой (для совместимости с жестами мышью).<br>
`+` Добавлен вызов API браузера для проверки безопасности перед открытием ссылок.<br>
`*` Небольшие внутренние улучшения и оптимизации.<br>

##### 0.3.7.2 (2012-09-10)
`x` Исправлена несовместимость "долгого" клика левой кнопкой мыши с расширением <a href="https://addons.mozilla.org/firefox/addon/budaneki/">budaneki</a>.<br>

##### 0.3.7.1 (2012-09-03)
`x` Исправлено: настройка <em>extensions.rightlinks.ui.toolbarbuttonCheckedStyle</em> не работала для только что добавленной кнопки.<br>

##### 0.3.7 (2012-09-03)
`+` Добавлена возможность открытия ссылок "долгим" кликом левой кнопкой мыши.<br>
`+` Добавлены скрытые настройки для открытия ссылок в новых окнах (<em>extensions.rightlinks.loadInWindow</em> и <em>extensions.rightlinks.loadInWindow.left</em>).<br>
`*` Улучшена совместимость с жестами мышью при переключении вкладок.<br>
`x` Исправлена работа настройки <em>extensions.rightlinks.ui.closeMenuRightClick</em> в Firefox 16.0a1 (помимо закрытия меню переключались галочки).<br>
`+` Добавлено сочетание клавиш Alt+F2 для открытия меню настроек (настройка <em>extensions.rightlinks.key.showSettingsPopup</em>).<br>
`+` Добавлена поддержка определения ссылок в инспекторе CSS-правил (Инструменты – Веб-разработка – Инспектор – Стиль) и скрытая настройка <em>extensions.rightlinks.enabledOnCSSEditorLinks</em>.<br>
`+` Добавлена поддержка определения ссылок в веб-консоли (Инструменты – Веб-разработка – Веб-консоль).<br>
`x` Исправлено отображение кнопки при включенной настройке <em>extensions.rightlinks.ui.toolbarbuttonCheckedStyle</em>.<br>

##### 0.3.6.3 (2012-04-09)
`x` Исправлено открытие JavaScript-ссылок при отключении галочки "Открывать JavaScript-ссылки (javascript: …)" (регрессия версии 0.3.6.1pre2).<br>

##### 0.3.6.2 (2012-04-09)
`x` Исправлено открытие JavaScript-ссылок (javascript:...) в фоне.<br>

##### 0.3.6.1 (2012-04-03)
`x` Исправлена обработка ссылок вида site.com/#!... на сайтах, сделанных полностью на JavaScript (например, http://twitter.com/).<br>

##### 0.3.6.1pre3 (2012-01-27)
`*` Немного оптимизирован код для чтения и сохранения настроек.<br>
`*` Галочка "Включено" показывается только при открытии меню настроек из управления дополнениями (во всех остальных случаях достаточно кликнуть по пункту меню или кнопке, чтобы включить/выключить).<br>
`*` Небольшие улучшения кода.<br>

##### 0.3.6 (2012-01-07)
`+` Добавлены "стандартные" настройки (доступны из управления дополнениями).<br>
`+` Добавлена галочка "Включено" в меню настроек.<br>

##### 0.3.5.4pre11 (2011-08-09)
`+` Добавлена поддержка XUL-ссылок (например, в консоли ошибок, если открыть ее в боковой панели).<br>
`+` Добавлена тестовая поддержка определения ссылок от расширения <a href="https://addons.mozilla.org/firefox/addon/firebug/">Firebug</a>.<br>
`+` Добавлена настройка для отключения закрытия меню настроек при клике правой кнопкой мыши (по умолчанию меню больше не закрывается).<br>
`x` Исправлено белое пятно у иконки 16x16 при использовании темной темы оформления.<br>
`+` Отключено определение изображений со страницы от расширения <a href="https://addons.mozilla.org/firefox/addon/speed-dial/">Speed Dial</a> (настройка <em>extensions.rightlinks.enabledOnSpeedDialImages</em>).<br>
`+` Добавлен пункт в меню Firefox – Настройки (только Firefox 4 и выше).<br>
`x` Исправлено подавление открытия контекстного меню при наличии расширения <a href="https://addons.mozilla.org/firefox/addon/righttoclick/">RightToClick</a>.<br>

##### 0.3.5.4pre2 (2010-07-23)
`+` Добавлена скрытая настройка <em>extensions.rightlinks.enabledOnSingleImages</em> для отключения обработки кликов по открытым отдельно картинкам.<br>

##### 0.3.5.4pre1 (2010-07-17)
`+` Если установлено расширение <a href="https://addons.mozilla.org/firefox/addon/5447/">Tab Kit</a>, ссылки (но не закладки) будут открываться в дочерних вкладках.<br>

##### 0.3.5.3 (2010-07-13)
`x` Исправлено определение закладок и элементов журнала в Firefox 3.7a5pre+.<br>
`+` Добавлена возможность полностью убрать отключение обработки клика после перемещении мыши (нужно установить <em>extensions.rightlinks.disallowMousemoveDist</em> в -1).<br>
`*` Небольшие улучшения кода.<br>
`+` Добавлена поддержка обработки кликов по картинкам.<br>

##### 0.3.5.2 (2010-02-12)
`*` Улучшен механизм предотвращения появления контекстного меню.<br>

##### 0.3.5.1 (2010-02-08)
`+` Добавлена возможность отключать закрытие меню настроек после клика (настройка <em>extensions.rightlinks.ui.closeMenu</em>), по умолчанию меню не закрывается. Только Firefox 3.0+.<br>
`x` Исправлено отображение контекстного меню (показывалось для ссылки, а не для того элемента, по которому кликнули).<br>

##### 0.3.5.0 (2010-01-25)
`*` Всплывающее сообщение при переключении статуса появляется только если все элементы управления скрыты.<br>
`+` Добавлено обновление состояния кнопки в toolbarpalette.<br>
`*` Настройка <em>extensions.rightlinks.hideBookmarksPopup</em> переименована в <em>extensions.rightlinks.closePopups</em>.<br>
`+` Исправлено определение ссылок вида `<area href="http://..." />`.<br>
`x` Исправлено снятие обработчиков событий (регрессия версии 0.3.5.0b2).<br>
`+` Добавлен пункт меню для настройки вида кнопки (настройка <em>extensions.rightlinks.ui.toolbarbuttonCheckedStyle</em>).<br>

##### 0.3.5.0b3 (2009-11-12)
`*` Вместо chrome://global/content/nsUserSettings.js используется свой сервис для чтения/изменения настроек.<br>
`*` Добавлено кэширование значений настроек для увеличения быстродействия.<br>
`*` Имена настроек переименованы из rightlinks.* в extensions.rightlinks.*.<br>
`*` Настройка <em>rightlinks.hideItemsMode</em> заменена на две отдельные – <em>extensions.rightlinks.ui.showInStatusbar</em> и <em>extensions.rightlinks.ui.showInToolsMenu</em>.<br>
`*` Настройки <em>rightlinks.keyModifiers</em> и <em>rightlinks.keyValue</em> заменены на одну – <em>extensions.rightlinks.key.toggleStatus</em>, используется синтаксис как в расширении <a href="http://adblockplus.org/en/preferences#sidebar_key">Adblock Plus</a>.<br>
`*` Настройка <em>rightlinks.toolbarbuttonCheckedStyle</em> переименована в <em>extensions.rightlinks.ui.toolbarbuttonCheckedStyle</em>.<br>
`*` Улучшено значение по умолчанию для настройки <em>extensions.rightlinks.filesLinksMask</em>.<br>
`*` Небольшая оптимизация кода.<br>
`+` Добавлена поддержка SeaMonkey 2.0.<br>
`x` Подкорректировано открытие JavaScript-ссылок (javascript: ...) в Firefox 3.7a1pre.<br>

##### 0.3.5.0b2 (2009-08-13)
`**` Улучшен способ предотвращения открытия контекстного меню.<br>
`**` Для отображения контекстного меню используется эмуляция кликов мышью (последовательность событий "mousedown", "mouseup", "contextmenu").<br>
`x` Исправлено отображение контекстного меню после задержки в Linux.<br>
`+` Добавлена настройка <em>rightlinks.loadVoidLinksWithHandlers</em> для разрешения открытия ссылок с обработчиками кликов.<br>
`+` Добавлена настройка <em>rightlinks.disallowMousemoveDist</em>, определяющая наибольшее допустимое перемещение курсора с зажатой правой кнопкой мыши.<br>
`*` Контекстное меню всегда показывается из позиции курсора.<br>
`*` Всплывающее сообщение показывается над строкой состояния.<br>
`+` Добавлена тестовая поддержка обработки кликов по ссылкам вида `<a href="">`, `<a href="#">`, `<a href="#nonexistentAnchor">`.<br>

##### 0.3.5.0b1 (2009-08-09)
`+` Добавлена поддержка <a href="http://en.wikipedia.org/wiki/XLink">XLink</a>.<br>
`+` Экспериментальная поддержка получения ссылок из боковой панели с журналом или закладками на основании кода расширения <a href="https://addons.mozilla.org/firefox/addon/7314">Places' Tooltips</a>, только Firefox 3.0 и выше.<br>
`+` Возможность отключения обработки кликов по элементам журнала.<br>
`+` Настройка <em>rightlinks.toolbarbuttonCheckedStyle</em> для отключения индикации нажатого состояния кнопки.<br>
`*` Улучшена эмуляция кликов по JavaScript-ссылкам.<br>

##### 0.3.1.1 (2008-11-22)
`x` Исправлен странный глюк с перетаскиванием ссылок в закладки.<br>

##### 0.3.1.0 (2008-09-14)
`+` Добавлен GUI для некоторых настроек (см. контекстное меню любого элемента от Right Links).<br>
`+` Возможность отключения обработки кликов по закладкам (настройка <em>rightlinks.enabledOnBookmarks</em>).<br>

##### 0.3.0.0 (2008-08-17)
`+` Отображение контекстного меню через 500 мс, если кнопка мыши не была отпущена (настраивается с помощью <em>rightlinks.showContextMenuTimeout</em>, -1 отключает показ меню).<br>
При этом в Firefox 3.0+ по истечении этого времени будет показано меню, а в предыдущих версиях ссылка или закладка "моргнет".<br>
`x` Исправлено открытие ссылок вида javascript: window.open( ... );<br>
`*` Изменена иконка всплывающего сообщения, которая теперь зависит от состояния расширения (будет видно, если иконка в строке состояния и кнопка на панели инструментов не используются).<br>
`+` Добавлена настройка <em>rightlinks.loadJavaScriptLinksInBackground</em> для открытия JavaScript-ссылок в фоновой вкладке.<br>
`x` Исправлена отправка referer'ов для документов с фреймами.<br>

##### 0.2.0.2 (2008-07-13)
`x` Исправлена небольшая ошибка в локали en-US.<br>
`x` Исправлено открытие JavaScript-закладок (закладурок/bookmarklets).<br>

##### 0.2.0.1 (2008-07-06)
`*` Настройка <em>rightlinks.checkForFilesLinks</em> заменена на <em>rightlinks.filesLinksPolicy</em>:<br>
0 – не проверять ссылки (соответствует старому <em>rightlinks.checkForFilesLinks</em> = false)<br>
1 – открывать ссылки на файлы в текущей вкладке (соответствует старому <em>rightlinks.checkForFilesLinks</em> = true)<br>
2 – отключать Right Links на таких ссылках (показывать контекстное меню)<br>
`*` Улучшено распознавание "пустых" ссылок.<br>

##### 0.2.0.0 (2008-06-25)
`+` Добавлен перехват кликов по закладкам.<br>
`x` Настройка <em>rightlinks.sendReferrer</em> переименована в <em>rightlinks.sendReferer</em> (см. http://en.wikipedia.org/wiki/HTTP_referer) – будьте внимательны!<br>
`+` Настройка <em>rightlinks.hideBookmarksPopup</em> (при false список закладок не закрывается после открытия ссылки).<br>
`+` Если установлено расширение <a href="https://addons.mozilla.org/ru/firefox/addon/5890">Tree Style Tab</a>, ссылки (но не закладки) будут открываться в дочерних вкладках.<br>
`+` Добавлена совместимость с расширением <a href="https://addons.mozilla.org/ru/firefox/addon/4086">Highlander</a>.<br>
`+` Для "пустых" ссылок с onClick, onMouseDown или onMouseUp-обработчиком имитируется клик левой кнопкой мыши.<br>
`+` Настройка <em>rightlinks.notifyVoidLinksWithHandlers</em> – сообщать о "пустых" ссылках с обработчиками.<br>
`+` Настройка <em>rightlinks.checkForFilesLinks</em> для открытия ссылок, подходящих под маску (настройка <em>rightlinks.filesLinksMask</em>), в текущей вкладке.<br>
`*` Сочетание клавиш по умолчанию заменено на F2 (в Firefox 3.0 работает Ctrl+Shift+? [Shift+/ = ?], а в предыдущих версиях – Ctrl+Shift+/) – будьте внимательны!<br>

##### 0.1.3.1 (2008-04-28)
`+` Добавлена кнопка для панелей инструментов.<br>

##### 0.1.3.0 (2008-04-28)
`+` Все изменения настроек, кроме сочетания клавиш, не требуют перезапуска (добавлен observer настроек).<br>

##### 0.1.2.3 beta (2008-04-25)
`+` Иконка в строке состояния.<br>
`+` Добавлена настройка <em>rightlinks.toggleItemsMode</em>: 0 – показывать все, 1 – скрыть все, 2 – скрыть пункт меню, 3 – скрыть значок в строке состояния.<br>

##### 0.1.2.2 (2008-04-05)
`*` Тестирование и проверка кода.<br>

##### 0.1.2.1 (2008-03-31)
`*` Улучшена работа с контекстным меню в Linux (при <em>rightlinks.debug</em> = true).<br>

##### 0.1.1.0 (2008-03-22)
`*` Собственное всплывающее окошко (работает в Linux).<br>
`*` Изменено сочетание клавиш по умолчанию с Ctrl+Shift+L на Ctrl+Shift+/ (настройки <em>rightlinks.keyValue</em> и <em>rightlinks.keyModifiers</em>).<br>

##### 0.1.0.0 (2008-03-22)
`*` Расширение теперь работает для любых ссылок внутри главного окна браузера.<br>
`*` Улучшен способ получения ссылок.<br>
`x` JavaScript-ссылки теперь работают во фреймах.<br>

##### 0.0.2.4 (2008-02-16)
`*` Небольшое улучшение способа поиска тэга `<a>`.<br>

##### 0.0.2.3 (2008-02-03)
`*` Перепаковка расширения (4,4 кб вместо 5,2 кб).<br>
`x` Упаковка в .jar файл для предотвращения проблем безопасности (баг Firefox <a href="https://bugzilla.mozilla.org/show_bug.cgi?id=413250">#413250</a>).<br>

##### 0.0.2.2 (2007-11-13)
`+` Добавлена возможность локализации (перевода) (доступны две локали: ru и en-US).<br>
`+` <em>rightlinks.sendReferrer</em> – отправлять referrer (источник перехода), если true.<br>

##### 0.0.2.1 (2007-11-10)
`*` Небольшая коррекция кода.<br>
`+` Добавлена новая настройка <em>rightlinks.loadInBackground</em>:<br>
true – открывать новые вкладки в фоне<br>
false – переключаться на открываемые вкладки<br>