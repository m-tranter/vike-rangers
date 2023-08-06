<template>
  <div v-if="item.title">
    <a class="cec-button" href="/">Back to results</a>
    <h2 class="selected-item-details--title text-center">
      {{ item.title }}
    </h2>
    <template
      v-if="
      formatDate(item.dateStartEnd.from) ===
      formatDate(item.dateStartEnd.to)
      "
      >
      <p class="text-center fs-5">
      {{ formatDate(item.dateStartEnd.from) }}.
      </p>
    </template>
    <template v-else>
      <p class="text-center fs-5">
      {{ formatDate(item.dateStartEnd.from) }} to
      {{ formatDate(item.dateStartEnd.to) }}.
      </p>
    </template>
    <div class="selected-item-details">
      <div class="row">
        <div class="col-12">
          <img
          v-if="item.image != null"
          class="rounded mx-auto d-block featured-img"
          v-bind:src="`https://www.cheshireeast.gov.uk/${item.image.asset.sys.uri}`"
          v-bind:alt="item.title"
          />
          <hr />
        </div>
        <div class="col-lg-6 pb-lg-2">
          <h3>Description</h3>
          <div
            class="selected-item-details--description"
            v-html="item.description"
            ></div>
        </div>
        <div class="col-lg-6 pb-2">
          <h3>Details</h3>
          <template
            v-if="
            formatDate(item.dateStartEnd.from) ===
            formatDate(item.dateStartEnd.to)
            "
            >
            <p>
            <strong>Time:</strong> {{ getTime(item.dateStartEnd.from) }} -
            {{ getTime(item.dateStartEnd.to) }}.
            </p>
          </template>
          <template v-else>
            <p>
            <strong>From: </strong>{{ getTime(item.dateStartEnd.from) }},
            {{ formatDate(item.dateStartEnd.from) }}.
            </p>
            <p>
            <strong>To: </strong>{{ getTime(item.dateStartEnd.to) }},
            {{ formatDate(item.dateStartEnd.to) }}.
            </p>
          </template>
          <p><strong>Leader(s):</strong> {{ item.leaders }}</p>
          <p>
          <strong>More information:</strong>
          </p>
          <div v-html="item.eventInformation"></div>
          <p><strong>Tags:</strong></p>
          <ul>
            <li v-for="tag in item.tags" v-bind:key="tag.key">{{ tag.name }}</li>
          </ul>
          <h3>Meeting point</h3>
          <div v-html="item.meetingPoint"></div>
          <div class="selected-item-details__map">
            <div id="map" ref="mapDiv">
              <a
                target="_blank"
                v-bind:href="
                'https://maps.google.com/maps?q=' +
                'item.mapLocation.lat' +
                ',' +
                'item.mapLocation.lon'
                "
                class="cec-button cec-button-forward"
                role="button"
                aria-pressed="true"
                >
                Get Directions
                <small>(opens new window)</small></a
              >
            </div>
          </div>
        </div>
        <div class="col-12">
          <hr />
          <a class="cec-button" href="/">Back to results</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SelectedItem',
  props: ['id'],
  data () {
    return {
      item: {},
      dateOptions: {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }
    }
  },
  computed: {
    copyItems() {
      return this.$store.state.copyItems;
    }
  },
  methods: {
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
  },
};
</script>
