
import { defineStore } from 'pinia'

export const useEntryStore = defineStore('entries', {
  state: () => ({
    items: [],
    copyItems: [],
    categoriesChecked: [],
    rxDate: /^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}:\d{2})?(?:\.\d*)?Z?$/,
    url: 'https://cms-chesheast.cloud.contensis.com/api/delivery/projects/website/contentTypes/rangerEvents/entries?accessToken=QCpZfwnsgnQsyHHB3ID5isS43cZnthj6YoSPtemxFGtcH15I&pageSize=500',
    dateOptions: {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    },
    pageIndex: 0,
    totalCount: 0,
    pageSize: 10,
    pageCount: 0,
    pageBtns: [],
    searchFields: ['title', 'description'],
    searchAlert: false,
    searchTerm: '',
    lastSearch: '',
    fromDate: '',
    toDate: '',
    filterField: 'tags',
    categories: [
      'Bring a packed lunch',
      'Bring binoculars if you have them',
      'Car parking charge',
      'Children must be accompanied by an adult',
      'Easy walking grade',
      'Full accessibility - level or ramped access. Accessible toilets available',
      'Healthy walk / Event',
      'Historial walk / Event',
      'Ideal for families and accompanied children',
      'Moderate walking grade',
      'Partial accessibility - level or ramped access',
      'Partnership event',
      'Places limited - please book in advance',
      'Please leave your dog at home',
      'Please wear suitable boots and clothing',
      'Refreshment shop, opportunity for refreshments',
      'Strenuous walking grade',
      'There is a charge for this event',
      'Wildlife walk / Event',
    ],
    firstRender: true,
  }),
  actions: {
    clearAlert: function () {
      this.searchAlert = false;
    },
    searchFilter: function () {
      let fromDate = this.fromDate.length > 0 ? new Date(this.fromDate) : false;
      let toDate = this.toDate.length > 0 ? new Date(this.toDate) : false;
      this.searchedItems = this.filteredItems.filter((item) =>
        this.searchFields.some((term) => {
          return (
            (!this.searchTerm ||
              item[term]
                .toLowerCase()
                .includes(this.searchTerm.toLowerCase())) &&
            (!fromDate || item.dateStartEnd.to > fromDate) &&
            (!toDate || item.dateStartEnd.to < toDate)
          );
        }),
      );
      if (this.searchedItems.length > 0) {
        this.searchedItems.sort(this.sortDate());
      }
      this.calculatePages();
    },
    filterByCategories: function () {
      this.filteredItems = [];
      if (this.categoriesChecked.length === 0) {
        this.filteredItems = this.copyItems.slice();
      } else {
        this.filteredItems = this.copyItems.filter((elem) =>
          elem[this.filterField]
            .map((a) => a.name)
            .some((cat) => this.categoriesChecked.includes(cat)),
        );
      }
      this.searchFilter();
    },
    resetSearch: function () {
      this.searchTerm = '';
      this.fromDate = '';
      this.toDate = '';
      this.searchedItems = this.filteredItems.slice();
      this.calculatePages();
    },
    calculatePages: function () {
      this.totalCount = this.searchedItems.length;
      this.pageCount = Math.ceil(this.totalCount / this.pageSize);
      this.pageIndex = 0;
      this.pageBtns = Array.from({ length: this.pageCount }, (_, i) => i + 1);
      this.createPages();
      this.items = this.pages[0];
    },
    createPages: function () {
      this.pages = [
        ...Array(Math.ceil(this.searchedItems.length / this.pageSize)),
      ].map((_) => this.searchedItems.splice(0, this.pageSize));
    },
    goToPage: function (pageNum) {
      document.getElementById('contentTypesContainer').scrollIntoView();
      this.items = this.pages[pageNum - 1];
      this.pageIndex = pageNum - 1;
      this.lastSearch = this.searchTerm;
    },
    applyFilters: function (cat) {
      const index = this.categoriesChecked.indexOf(cat);
      if (index > -1) {
        this.categoriesChecked.splice(index, 1);
      } else {
        this.categoriesChecked.push(cat);
      }
      this.filterByCategories();
      this.searchFilter();
    },
    formatDate: function (value) {
      return value.toLocaleString('en-GB', this.dateOptions);
    },
    getTime: function (value) {
      let time = value.toLocaleTimeString([], {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
      if (time === '0:00 pm') {
        return '12 noon';
      } else if (time.startsWith('0')) {
        time = `12${time.slice(1)}`;
      }
      return time.replace(' ', '');
    },
    getEntries: async function () {
      useFetch(this.url).then((data) => {
        this.copyItems = this.createDates(data.data._rawValue.items);
        if (this.copyItems.length) {
          this.copyItems.sort(this.sortDate());
        }
        this.filteredItems = this.copyItems.slice();
        this.searchedItems = this.copyItems.slice();
        this.calculatePages();
      });
    },
    sortDate: function () {
      return (a, b) => {
        return a.dateStartEnd.from - b.dateStartEnd.from;
      };
    },
    dateHelper: function (obj) {
      return Object.fromEntries(
        Object.entries(obj).map(([k, v]) => {
          // Date found.
          if (typeof v === 'string' && v.match(this.rxDate)) {
            return [k, new Date(v)];
          }
          // Found an object as the value.
          if (v && v.constructor === Object) {
            return [k, this.dateHelper(v)];
          }
          // Found an array of objects.
          if (Array.isArray(v) && v[0] && v[0].constructor === Object) {
            return [k, this.createDates(v)];
          }
          return [k, v];
        }),
      );
    },
    createDates: function (arr) {
      return arr.map((e) => this.dateHelper(e));
    },
  },
});

