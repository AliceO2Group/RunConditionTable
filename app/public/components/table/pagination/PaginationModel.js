/**
 * @license
 * Copyright CERN and copyright holders of ALICE O2. This software is
 * distributed under the terms of the GNU General Public License v3 (GPL
 * Version 3), copied verbatim in the file "COPYING".
 *
 * See http://alice-o2.web.cern.ch/license for full licensing information.
 *
 * In applying this license CERN does not waive the privileges and immunities
 * granted to it by virtue of its status as an Intergovernmental Organization
 * or submit itself to any jurisdiction.
 */
import { Observable } from '/js/src/index.js';

const DEFAULT_CURRENT_PAGE = 1;
const DEFAULT_ITEMS_COUNT = 0;
const ENABLE_INFINITE_MODE_BY_DEFAULT = false;

const INFINITE_SCROLL_CHUNK_SIZE = 19;

/**
 * Model to handle pagination
 */
export class PaginationModel extends Observable {
    /**
     * Constructor
     * @param {UserPreferences} userPreferences user preferences
     */
    constructor(userPreferences) {
        super();

        this._userPreferences = userPreferences;
        this._itemsPerPage = userPreferences.rowsOnSite;
        this._currentPage = DEFAULT_CURRENT_PAGE;
        this._itemsCount = DEFAULT_ITEMS_COUNT;
        this._isInfiniteScrollEnabled = ENABLE_INFINITE_MODE_BY_DEFAULT;

        this._itemsPerPageSelector$ = new Observable();
    }

    /**
     * Reset the pagination to its default values
     *
     * @return {void}
     */
    reset() {
        this._itemsPerPage = this._userPreferences.rowsOnSite;
        this._currentPage = DEFAULT_CURRENT_PAGE;
        this._itemsCount = DEFAULT_ITEMS_COUNT;
        this._isInfiniteScrollEnabled = ENABLE_INFINITE_MODE_BY_DEFAULT;
    }

    /**
     * Defines the current page without notifying observers
     *
     * @param {number} page the current page
     * @return {boolean} true if the page actually changed, else false
     */
    silentlySetCurrentPage(page) {
        if (this._currentPage !== page) {
            this._currentPage = page;
            return true;
        }
        return false;
    }

    /**
     * If the current page is not the last one, navigate to the next one
     *
     * @return {void}
     */
    goToNextPage() {
        if (this._currentPage < this.pagesCount) {
            this.currentPage = this.currentPage + 1;
        }
    }

    /**
     * Navigate to the target page
     *
     * @param {number} page target page
     * @return {void}
     */
    goToPage(page) {
        if (page < this.pagesCount) {
            this.currentPage = page;
        }
    }

    /**
     * Returns the current page
     *
     * @return {number} the current page
     */
    get currentPage() {
        return this._currentPage;
    }

    /**
     * Defines the current page and notify the change to observers
     *
     * @param {number} page the current page
     */
    set currentPage(page) {
        if (this.silentlySetCurrentPage(page)) {
            this.notify();
        }
    }

    /**
     * Returns the amount of items displayed per page
     *
     * @return {number} the amount of items per page
     */
    get itemsPerPage() {
        return this.isInfiniteScrollEnabled
            ? INFINITE_SCROLL_CHUNK_SIZE
            : this._itemsPerPage;
    }

    /**
     * Defines the amount of items displayed per page
     *
     * @param {number} amount the amount of items
     */
    set itemsPerPage(amount) {
        if (this._isInfiniteScrollEnabled || this._itemsPerPage !== amount) {
            this._itemsPerPage = amount;
            this._currentPage = DEFAULT_CURRENT_PAGE;
        }
        this._isAmountDropdownVisible = false;
        this._isInfiniteScrollEnabled = false;

        this.notify();
    }

    /**
     * Returns the offset of the first item of the current page
     *
     * @return {number} the first item offset
     */
    get firstItemOffset() {
        return (this._currentPage - 1) * this.itemsPerPage;
    }

    /**
     * Returns the total amount of pages available
     *
     * @return {number} the available pages count
     */
    get pagesCount() {
        return Math.ceil(this.itemsCount / this.itemsPerPage);
    }

    /**
     * Returns the total amount of items paginated
     *
     * @return {number} the amount of items
     */
    get itemsCount() {
        return this._itemsCount;
    }

    /**
     * Define the total amount of items paginated
     *
     * @param {number} itemsCount the amount of items
     */
    set itemsCount(itemsCount) {
        this._itemsCount = itemsCount;
    }

    /**
     * States if the infinite scroll mode is enabled
     *
     * @return {boolean} true if infinite scroll mode is enabled
     */
    get isInfiniteScrollEnabled() {
        return this._isInfiniteScrollEnabled;
    }

    /**
     * Enable the infinite mode
     *
     * @return {void}
     */
    enableInfiniteMode() {
        this._isInfiniteScrollEnabled = true;
        this._isAmountDropdownVisible = false;
        this._currentPage = DEFAULT_CURRENT_PAGE;
        this.notify();
    }

    /**
     * Observable notified when the item per page selector change (either a custom value is typed, or its visibility change)
     *
     * @return {Observable} the selector observable
     */
    get itemsPerPageSelector$() {
        return this._itemsPerPageSelector$;
    }
}
