package com.finance.app.domain.asset;

import com.finance.app.domain.asset.dto.AssetRequestDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AssetService {

    private final AssetRepository assetRepository;

    public List<Asset> getAllAssets() {
        return assetRepository.findAllByOrderByCreatedAtDesc();
    }

    public Asset getAssetById(Long id) {
        return assetRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 자산입니다. ID: " + id));
    }

    @Transactional
    public Asset createAsset(AssetRequestDto dto) {
        Asset asset = Asset.builder()
                .assetType(dto.getAssetType() != null ? dto.getAssetType() : determineAssetType(dto.getCategory()))
                .category(dto.getCategory() != null ? dto.getCategory() : "기타")
                .name(dto.getName())
                .purchaseAmount(dto.getPurchaseAmount())
                .currentValue(dto.getCurrentValue())
                .marketPrice(dto.getMarketPrice() != null ? dto.getMarketPrice() : dto.getCurrentValue())
                .taxRate(dto.getTaxRate())
                .interestRate(dto.getInterestRate())
                .targetDate(dto.getTargetDate())
                .dDay(dto.getDDay())
                .build();

        return assetRepository.save(asset);
    }

    @Transactional
    public Asset updateAsset(Long id, AssetRequestDto dto) {
        Asset asset = getAssetById(id);
        if (dto.getAssetType() != null) asset.setAssetType(dto.getAssetType());
        if (dto.getCategory() != null) asset.setCategory(dto.getCategory());
        if (dto.getName() != null) asset.setName(dto.getName());
        if (dto.getPurchaseAmount() != null) asset.setPurchaseAmount(dto.getPurchaseAmount());
        if (dto.getCurrentValue() != null) asset.setCurrentValue(dto.getCurrentValue());
        if (dto.getMarketPrice() != null) asset.setMarketPrice(dto.getMarketPrice());
        if (dto.getTaxRate() != null) asset.setTaxRate(dto.getTaxRate());
        if (dto.getInterestRate() != null) asset.setInterestRate(dto.getInterestRate());
        if (dto.getTargetDate() != null) asset.setTargetDate(dto.getTargetDate());
        if (dto.getDDay() != null) asset.setDDay(dto.getDDay());

        return asset;
    }

    @Transactional
    public void deleteAsset(Long id) {
        Asset asset = getAssetById(id);
        assetRepository.delete(asset);
    }

    private AssetType determineAssetType(String category) {
        if ("주식".equals(category)) return AssetType.STOCK;
        if ("예금".equals(category)) return AssetType.DEPOSIT;
        if ("부동산".equals(category)) return AssetType.REAL_ESTATE;
        return AssetType.STOCK;
    }
}
