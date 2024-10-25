<template>
  <div class="container">
    <form @submit.prevent="submitAddress" class="address-form">
      <div class="field">
        <label class="label">First Name</label>
        <div class="control">
          <input
              :value="address.FirstName"
              type="text"
              class="input"
              placeholder="Enter your first name"
              required
              @input="updateAddress('FirstName', $event.target.value)"
          />
        </div>
      </div>

      <div class="field">
        <label class="label">Last Name</label>
        <div class="control">
          <input
              :value="address.LastName"
              type="text"
              class="input"
              placeholder="Enter your last name"
              required
              @input="updateAddress('LastName', $event.target.value)"
          />
        </div>
      </div>

      <div class="field">
        <label class="label">Company Name</label>
        <div class="control">
          <input
              :value="address.CompanyName"
              type="text"
              class="input"
              placeholder="Enter your company name"
              @input="updateAddress('CompanyName', $event.target.value)"
          />
        </div>
      </div>

      <div class="field">
        <label class="label">Address Line 1</label>
        <div class="control">
          <input
              :value="address.AddressLine1"
              type="text"
              class="input"
              placeholder="Enter address line 1"
              required
              @input="updateAddress('AddressLine1', $event.target.value)"
          />
        </div>
      </div>

      <div class="field">
        <label class="label">Address Line 2</label>
        <div class="control">
          <input
              :value="address.AddressLine2"
              type="text"
              class="input"
              placeholder="Enter address line 2"
              @input="updateAddress('AddressLine2', $event.target.value)"
          />
        </div>
      </div>

      <div class="field">
        <label class="label">Town</label>
        <div class="control">
          <input
              :value="address.Town"
              type="text"
              class="input"
              placeholder="Enter your town"
              required
              @input="updateAddress('Town', $event.target.value)"
          />
        </div>
      </div>

      <div class="field">
        <label class="label">Zip/Postal Code</label>
        <div class="control">
          <input
              :value="address.ZipPostalCode"
              type="text"
              class="input"
              placeholder="Enter your zip/postal code"
              required
              @input="updateAddress('ZipPostalCode', $event.target.value)"
          />
        </div>
      </div>

      <div class="field">
        <label class="label">State/Province</label>
        <div class="control">
          <input
              :value="address.StateProvince"
              type="text"
              class="input"
              placeholder="Enter your state/province"
              @input="updateAddress('StateProvince', $event.target.value)"
          />
        </div>
      </div>

      <div class="field">
        <label class="label">Country</label>
        <div class="control">
          <div class="select">
            <select
                :value="address.Country"
                required
                @input="updateAddress('Country', $event.target.value)"
            >
              <option value="" disabled>Select your country</option>
              <option v-for="country in countries" :key="country" :value="country">
                {{ country }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <div class="field">
        <label class="label">Telephone</label>
        <div class="control">
          <input
              :value="address.Telephone"
              type="tel"
              class="input"
              placeholder="Enter your telephone number"
              required
              @input="updateAddress('Telephone', $event.target.value)"
          />
        </div>
      </div>

      <div class="field">
        <label class="label">Fax Number</label>
        <div class="control">
          <input
              :value="address.FaxNumber"
              type="text"
              class="input"
              placeholder="Enter your fax number"
              @input="updateAddress('FaxNumber', $event.target.value)"
          />
        </div>
      </div>

      <div class="field">
        <label class="label">Email</label>
        <div class="control">
          <input
              :value="address.Email"
              type="email"
              class="input"
              placeholder="Enter your email address"
              required
              @input="updateAddress('Email', $event.target.value)"
          />
        </div>
      </div>

      <div class="buttons is-centered mt-4">
        <button type="reset" @click="clearForm" class="button is-warning">Clear Form</button>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import {defineComponent, Prop} from 'vue';
import InfigoAddress from "@/types/demo/address";
import AddressState from "@/services/cache/address-state";

export default defineComponent({
  emits: ['address-change'],
  props: {
    address: Object as Prop<InfigoAddress>
  },
  data() {
    return {
      countries: [
        'United States', 'Canada', 'United Kingdom', 'Australia', 'Germany',
        'France', 'Spain', 'Italy', 'Netherlands', 'Brazil',
        'India', 'China', 'Japan', 'Mexico', 'South Africa',
        // Add more countries as needed
      ],
    };
  },
  methods: {
    clearForm(){
      this.$emit('address-change', AddressState.getDefaultAddress());
    },
    updateAddress(field: string, value: string) {
      const newAddress = {
        ...this.address,
        [field]: value
      }
      this.$emit('address-change', newAddress);
    },
    submitAddress() {
      const newAddress = {
        ...this.address
      }
      console.log('Address submitted:', newAddress);
      this.$emit('address-change', newAddress);
    },
  },
});
</script>

<style scoped>
.address-form {
  margin: 2rem 0;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #eaeaea;
  background-color: #f9f9f9;
}

.field {
  margin-bottom: 1rem;
}

.buttons {
  margin-top: 1rem;
}
</style>
