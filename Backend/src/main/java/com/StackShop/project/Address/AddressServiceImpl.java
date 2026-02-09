package com.StackShop.project.Address;

import com.StackShop.project.exceptions.ResourceNotFoundException;
import com.StackShop.project.user.User;
import com.StackShop.project.user.UserRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AddressServiceImpl implements AddressService {

    @Autowired
    ModelMapper modelMapper;

    @Autowired
    AddressRepository addressRepository;

    @Autowired
    UserRepository userRepository;

    @Override
    public AddressDTO createAddress(AddressDTO addressDTO, User user) {
        Address address = modelMapper.map(addressDTO, Address.class);
        List<Address> addressList = user.getAddresses();
        addressList.add(address);
        user.setAddresses(addressList);
        address.setUser(user);
        Address savedAddress = addressRepository.save(address);

        return modelMapper.map(savedAddress, AddressDTO.class);
    }

    @Override
    public List<AddressDTO> getAddresses() {
        // Use optimized query with JOIN FETCH to avoid N+1 problem
        List<Address> addresses = addressRepository.findAllWithUser();
        return addresses.stream()
                .map(address -> modelMapper.map(address, AddressDTO.class))
                .toList();
    }

    @Override
    public AddressDTO getAddressesById(Integer addressId) {
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new ResourceNotFoundException("Address", "addressId", addressId));
        return modelMapper.map(address, AddressDTO.class);
    }

    @Override
    public List<AddressDTO> getUserAdresses(User user) {
        List<Address> addresses = user.getAddresses();
        return addresses.stream()
                .map(address -> modelMapper.map(address, AddressDTO.class))
                .toList();
    }

    @Override
    public AddressDTO updateAddress(Integer addressId, AddressDTO addressDTO) {
        Address addressFromDb = addressRepository.findById(addressId)
                .orElseThrow(() -> new ResourceNotFoundException("Address", "addressId", addressId) );

        addressFromDb.setStreet(addressDTO.getStreet());
        addressFromDb.setBuildingName(addressDTO.getBuildingName());
        addressFromDb.setCity(addressDTO.getCity());
        addressFromDb.setState(addressDTO.getState());
        addressFromDb.setZipCode(addressDTO.getZipCode());
        addressFromDb.setCountry(addressDTO.getCountry());
        Address updatedAddress = addressRepository.save(addressFromDb);
        User user = addressFromDb.getUser();
        user.getAddresses().removeIf(address -> address.getAddressId() == addressId);
        user.getAddresses().add(updatedAddress);
        userRepository.save(user);

        return modelMapper.map(updatedAddress, AddressDTO.class);
    }

    @Override
    public String deleteAddress(Integer addressId) {
        Address addressFromDb = addressRepository.findById(addressId)
                .orElseThrow(() -> new ResourceNotFoundException("Address", "addressId", addressId));
        User user = addressFromDb.getUser();
        user.getAddresses().removeIf(address -> address.getAddressId() == addressId);
        userRepository.save(user);
        addressRepository.delete(addressFromDb);

        return "Address deleted successfully with addressId: " + addressId;
    }
}
