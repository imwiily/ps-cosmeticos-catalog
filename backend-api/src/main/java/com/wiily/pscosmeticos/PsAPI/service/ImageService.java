package com.wiily.pscosmeticos.PsAPI.service;

import com.wiily.pscosmeticos.PsAPI.domain.category.Category;
import com.wiily.pscosmeticos.PsAPI.infra.exception.exceptions.ImageIsNull;
import com.wiily.pscosmeticos.PsAPI.domain.product.Product;
import com.wiily.pscosmeticos.PsAPI.infra.config.AppProperties;
import net.coobird.thumbnailator.Thumbnails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class ImageService {
    @Autowired
    AppProperties properties;

    // Saves and return the image URL.
    public String imageProcessor(MultipartFile image, Object object) {
        if (image.isEmpty()) throw new ImageIsNull("The image sent to the API doesn't exist");
        var objectInfo = objectType(object);
        String imageName = objectInfo.getFirst() + "-" + objectInfo.get(1) + UUID.randomUUID() + ".webp";
        try {
            saveImage(image, objectInfo.getLast(), imageName);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        return properties.getApi().getDomainIp() + "/api/v1/image/" + imageName;
    }

    private void saveImage(MultipartFile image, String fileLocation, String imageName) throws IOException {
        File imageFolder = new File(fileLocation);
        if (!imageFolder.exists()) imageFolder.mkdirs();
        File file = new File(fileLocation + imageName);
        ImageIO.scanForPlugins();
        Thumbnails.of(image.getInputStream())
                .scale(1.0)
                .outputFormat("webp")
                .toFile(file);

    }


    private List<String> objectType(Object object) {
        List<String> list = new ArrayList<>();
        switch (object) {
            case Category c -> {
                list.add(c.getClass().getSimpleName());
                list.add(c.getSlug());
                list.add(properties.getStorage().getImageCategoryRoot());
            }
            case Product p -> {
                list.add(p.getClass().getSimpleName());
                list.add(p.getSlug());
                list.add(properties.getStorage().getImageProductRoot());
            }
            default -> throw new IllegalStateException("Unexpected value: " + object);
        }
        return list;
    }

    public String getImagePath(Category category) {
        String[] url = category.getImageUrl().split("/");
        return url[4];
    }
    public String getImagePath(Product product) {
        String[] url = product.getImage().split("/");
        return url[4];
    }
}
